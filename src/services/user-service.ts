import { prisma } from "../libs/prisma"
import { Address } from "@/types/address"
import { compare, hash } from "bcryptjs"
import jwt from "jsonwebtoken"


export const createUserService = async (name: string, email: string, password: string) => {
    const normalizedEmail = email.toLowerCase()

    const existingEmail = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existingEmail) return null

    const hashPassword = await hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email: normalizedEmail,
            password: hashPassword
        }
    })

    if (!user) return null
    return {
        id: user.id, name: user.name, email: user.email
    }
}

export const loginUserService = async (email: string, password: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not configured");
    }
    const normalizedEmail = email.toLowerCase()
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (!user) return null

    const validPassword = await compare(password, user.password)
    if (!validPassword) return null
    const token = jwt.sign(
        {
            id: user.id, email: user.email
        },
        process.env.JWT_SECRET!,
        { expiresIn: "3d" }
    )
    return token
}



export const createAddressService = async (userId: number, input: Address) => {
    const data = {
        zipcode: input.zipcode.trim(),
        street: input.street.trim(),
        number: input.number.trim(),
        city: input.city.trim(),
        state: input.state.trim(),
        country: input.country.trim(),
        complement: input.complement?.trim() || null,
        userId,
    }

    return prisma.userAddress.create({ data })

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