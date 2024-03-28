import { User } from "@prisma/client";
import {
	ContactResponse,
	CreateContactRequest,
	SearchContactRequest,
	UpdateContactRequest,
	toContactRespone,
} from "../model/contact.model";
import { ContactValidation } from "../validation/Contact/contact.validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response.error";
import { Pageable } from "../model/paging.model";

export class ContactService {
	static async create(
		user: User,
		request: CreateContactRequest
	): Promise<ContactResponse> {
		const contactRequest = Validation.validate(
			ContactValidation.CREATE,
			request
		);

		const data = {
			...contactRequest,
			...{ username: user.username },
		};

		const response = await prismaClient.contact.create({
			data: data,
		});

		return toContactRespone(response);
	}

	static async get(user: User, id: number): Promise<ContactResponse> {
		const response = await prismaClient.contact.findFirst({
			where: {
				username: user.username,
				id: id,
			},
		});
		if (!response) throw new ResponseError(404, "contact is not found!");

		return toContactRespone(response);
	}

	static async update(
		user: User,
		id: number,
		request: UpdateContactRequest
	): Promise<ContactResponse> {
		const contactRequest = Validation.validate(
			ContactValidation.UPDATE,
			request
		);

		const contact = await prismaClient.contact.findFirst({
			where: {
				id: id,
				username: user.username,
			},
		});

		if (!contact) throw new ResponseError(404, "contact is not found!");

		const response = await prismaClient.contact.update({
			where: {
				id: contact.id,
			},
			data: {
				first_name: contactRequest.first_name
					? contactRequest.first_name
					: contact.first_name,
				last_name: contactRequest.last_name
					? contactRequest.last_name
					: contact.last_name,
				email: contactRequest.email ? contactRequest.email : contact.email,
				phone: contactRequest.phone ? contactRequest.phone : contact.phone,
			},
		});
		return toContactRespone(response);
	}

	static async remove(user: User, id: number): Promise<string> {
		const contact = await prismaClient.contact.findFirst({
			where: {
				id: id,
				username: user.username,
			},
		});

		if (!contact) throw new ResponseError(404, "contact not found");

		await prismaClient.contact.delete({
			where: {
				id: id,
				username: user.username,
			},
		});

		return "OK";
	}

	static async search(
		user: User,
		request: SearchContactRequest
	): Promise<Pageable<ContactResponse>> {
		const searchRequest = Validation.validate(
			ContactValidation.SEARCH,
			request
		);

		const skip = (searchRequest.page - 1) * searchRequest.size;

		const filters = [];

		if (searchRequest.name) {
			filters.push({
				OR: [
					{
						first_name: {
							contains: searchRequest.name,
						},
					},
					{
						last_name: {
							contains: searchRequest.name,
						},
					},
				],
			});
		}

		if (searchRequest.email) {
			filters.push({
				email: {
					contains: searchRequest.email,
				},
			});
		}

		if (searchRequest.phone) {
			filters.push({
				phone: {
					contains: searchRequest.phone,
				},
			});
		}

		const contacts = await prismaClient.contact.findMany({
			where: {
				username: user.username,
				AND: filters,
			},
			take: searchRequest.size,
			skip: skip,
		});

		const total = await prismaClient.contact.count({
			where: {
				username: user.username,
				AND: filters,
			},
		});

		return {
			data: contacts.map((contact) => toContactRespone(contact)),
			paging: {
				current_page: searchRequest.page,
				total_page: Math.ceil(total / searchRequest.size),
				size: searchRequest.size,
			},
		};
	}
}
