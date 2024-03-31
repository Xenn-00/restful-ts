import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response.error";
import {
	AddressResponse,
	CreateAddressRequest,
	GetAddressRequest,
	UpdateAddressRequest,
	toAddressResponse,
} from "../model/address.model";
import { AddressValidation } from "../validation/Address/address.validation";
import { Validation } from "../validation/validation";
import { ContactService } from "./contact.service";

export class AddressService {
	static async create(
		user: User,
		request: CreateAddressRequest
	): Promise<AddressResponse> {
		const createRequest = Validation.validate(
			AddressValidation.CREATE,
			request
		);
		await ContactService.get(user, request.contact_id);

		const response = await prismaClient.address.create({
			data: createRequest,
		});
		return toAddressResponse(response);
	}

	static async get(
		user: User,
		request: GetAddressRequest
	): Promise<AddressResponse> {
		const getRequest = Validation.validate(AddressValidation.GET, request);
		await ContactService.get(user, getRequest.contact_id);
		const response = await prismaClient.address.findFirst({
			where: {
				contact_id: getRequest.contact_id,
				id: getRequest.id,
			},
		});

		if (!response) throw new ResponseError(404, "Address is not found!");

		return toAddressResponse(response);
	}

	static async update(
		user: User,
		request: UpdateAddressRequest
	): Promise<AddressResponse> {
		const updateRequest = Validation.validate(
			AddressValidation.UPDATE,
			request
		);
		await ContactService.get(user, updateRequest.contact_id);
		const address = await this.get(user, updateRequest);

		const response = await prismaClient.address.update({
			where: {
				contact_id: updateRequest.contact_id,
				id: updateRequest.id,
			},
			data: {
				street: updateRequest.street ? updateRequest.street : address.street,
				city: updateRequest.city ? updateRequest.city : address.city,
				province: updateRequest.province
					? updateRequest.province
					: address.province,
				country: updateRequest.country
					? updateRequest.country
					: address.country,
				postal_code: updateRequest.postal_code
					? updateRequest.postal_code
					: address.postal_code,
			},
		});

		return toAddressResponse(response);
	}

	static async remove(user: User, request: GetAddressRequest): Promise<string> {
		const removeRequest = Validation.validate(AddressValidation.GET, request);
		await ContactService.get(user, removeRequest.contact_id);
		const address = await this.get(user, removeRequest);

		if (!address) throw new ResponseError(404, "Address is not found!");

		await prismaClient.address.delete({
			where: {
				contact_id: removeRequest.contact_id,
				id: removeRequest.id,
			},
		});

		return "OK";
	}

	static async list(
		user: User,
		contactId: number
	): Promise<Array<AddressResponse>> {
		await ContactService.get(user, contactId); // validate contact id

		const responses = await prismaClient.address.findMany({
			where: {
				contact_id: contactId,
			},
		});

		return responses.map((response) => toAddressResponse(response));
	}
}
