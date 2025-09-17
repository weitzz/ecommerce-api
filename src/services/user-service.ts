import { prisma } from "@/libs/prisma"
import { hash } from "bcryptjs"
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

export const getCategoryBySlugService = async (slug: string) => {
    const category = await prisma.category.findFirst({
        where: { slug },
        select: {
            id: true, name: true, slug: true
        }
    })
    return category
}

export const getCategoryMetadataService = async (id: number) => {
    const metadata = await prisma.categoryMetadata.findMany({
        where: { categoryId: id },
        select: {
            id: true,
            name: true,
            values: {
                select: { id: true, label: true }
            },
        }
    })
    return metadata
}