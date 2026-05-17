import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { IncomeLevel, WorldTier, IQLevel, EducationLevel, Sex } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        tier: true,
        firstName: true,
        fatherName: true,
        grandfatherName: true,
        familyName: true,
        nickname: true,
        photoUrl: true,
        sex: true,
        birthDate: true,
        birthCountry: true,
        birthState: true,
        birthCity: true,
        birthTown: true,
        birthVillage: true,
        incomeLevel: true,
        worldTier: true,
        mobile1: true,
        mobile2: true,
        telephone: true,
        educationLevel: true,
        educationDegree: true,
        educationSchool: true,
        educationPhoto: true,
        iqLevel: true,
        nationalityId: true,
        nationalityPhoto: true,
        residenceState: true,
        residenceCity: true,
        residenceTown: true,
        residenceNo: true,
        residencePhoto: true,
        homeUnit: true,
        homeBuilding: true,
        homeStreet: true,
        homeCity: true,
        homeState: true,
        homeCountry: true,
        jobTitle: true,
        jobIncome: true,
        jobOrganization: true,
        jobCountry: true,
        guardianName: true,
        guardianMobile: true,
        guardianEmail: true,
        guardianResidence: true,
        guardianIncome: true,
      },
    })

    return NextResponse.json({ profile: user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Pick only profile fields from body
    const updateData: any = {}

    const allowedStrings = [
      "name",
      "image",
      "firstName",
      "fatherName",
      "grandfatherName",
      "familyName",
      "nickname",
      "photoUrl",
      "birthCountry",
      "birthState",
      "birthCity",
      "birthTown",
      "birthVillage",
      "mobile1",
      "mobile2",
      "telephone",
      "educationDegree",
      "educationSchool",
      "educationPhoto",
      "nationalityId",
      "nationalityPhoto",
      "residenceState",
      "residenceCity",
      "residenceTown",
      "residenceNo",
      "residencePhoto",
      "homeUnit",
      "homeBuilding",
      "homeStreet",
      "homeCity",
      "homeState",
      "homeCountry",
      "jobTitle",
      "jobIncome",
      "jobOrganization",
      "jobCountry",
      "guardianName",
      "guardianMobile",
      "guardianEmail",
      "guardianResidence",
    ]

    allowedStrings.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    })

    if (body.birthDate) {
      updateData.birthDate = new Date(body.birthDate)
    }

    // Parse enums safely
    if (body.sex && Object.values(Sex).includes(body.sex)) {
      updateData.sex = body.sex as Sex
    }
    if (body.incomeLevel && Object.values(IncomeLevel).includes(body.incomeLevel)) {
      updateData.incomeLevel = body.incomeLevel as IncomeLevel
    }
    if (body.worldTier && Object.values(WorldTier).includes(body.worldTier)) {
      updateData.worldTier = body.worldTier as WorldTier
    }
    if (body.educationLevel && Object.values(EducationLevel).includes(body.educationLevel)) {
      updateData.educationLevel = body.educationLevel as EducationLevel
    }
    if (body.iqLevel && Object.values(IQLevel).includes(body.iqLevel)) {
      updateData.iqLevel = body.iqLevel as IQLevel
    }
    if (body.guardianIncome && Object.values(IncomeLevel).includes(body.guardianIncome)) {
      updateData.guardianIncome = body.guardianIncome as IncomeLevel
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
