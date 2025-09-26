import { prisma } from "../libs/prisma"
import { Address } from "@/types/address"
import { compare, hash } from "bcryptjs"
import { v4 } from "uuid"
export const createUserService = async (name: string, email: string, password: string) => {
    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) return null

    const hashPassword = await hash(password, 10)
    const user = await prisma.user.create({
        data: {
            name, email: email.toLowerCase(), password: hashPassword
        }
    })

    if (!user) return null
    return {
        id: user.id, name: user.name, email: user.email
    }
}

export const loginUserService = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null

    const validPassword = await compare(password, user.password)
    if (!validPassword) return null
    const token = v4()
    await prisma.user.update({
        where: { id: user.id },
        data: { token }
    })

    return token
}

export const GetUserByIdTokenService = async (token: string) => {
    const user = await prisma.user.findFirst({ where: { token } })
    if (!user) return null
    return user.id
}

export const createAddressService = async (userId: number, address: Address) => {
    return await prisma.userAddress.create({
        data: {
            ...address,
            userId
        }
    })

}

export const getAddressService = async (userId: number) => {
    return await prisma.userAddress.findMany({
        where: { userId },
        select: {
            id: true,
            zipcode: true,
            street: true,
            number: true,
            city: true,
            state: true,
            country: true,
            complement: true

        }
    })

}

export const getAddressByIdService = async (userId: number, addressId: number) => {
    return await prisma.userAddress.findFirst({
        where: { id: addressId, userId },
        select: {
            id: true,
            zipcode: true,
            street: true,
            number: true,
            city: true,
            state: true,
            country: true,
            complement: true

        }
    })

}