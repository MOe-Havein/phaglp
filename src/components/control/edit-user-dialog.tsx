"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Role,
  SubscriptionTier,
  Sex,
  IncomeLevel,
  WorldTier,
  EducationLevel,
  IQLevel,
} from "@prisma/client";
import { updateUser, deleteUser } from "@/lib/control-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  role: z.nativeEnum(Role),
  tier: z.nativeEnum(SubscriptionTier).optional(),

  // Extended Profile
  firstName: z.string().optional().nullable(),
  fatherName: z.string().optional().nullable(),
  grandfatherName: z.string().optional().nullable(),
  familyName: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  sex: z.nativeEnum(Sex).optional().nullable(),
  birthDate: z.string().optional().nullable(),
  birthCountry: z.string().optional().nullable(),
  birthState: z.string().optional().nullable(),
  birthCity: z.string().optional().nullable(),
  birthTown: z.string().optional().nullable(),
  birthVillage: z.string().optional().nullable(),
  incomeLevel: z.nativeEnum(IncomeLevel).optional().nullable(),
  worldTier: z.nativeEnum(WorldTier).optional().nullable(),
  mobile1: z.string().optional().nullable(),
  mobile2: z.string().optional().nullable(),
  telephone: z.string().optional().nullable(),
  educationLevel: z.nativeEnum(EducationLevel).optional().nullable(),
  educationDegree: z.string().optional().nullable(),
  educationSchool: z.string().optional().nullable(),
  educationPhoto: z.string().optional().nullable(),
  iqLevel: z.nativeEnum(IQLevel).optional().nullable(),
  nationalityId: z.string().optional().nullable(),
  nationalityPhoto: z.string().optional().nullable(),
  residenceState: z.string().optional().nullable(),
  residenceCity: z.string().optional().nullable(),
  residenceTown: z.string().optional().nullable(),
  residenceNo: z.string().optional().nullable(),
  residencePhoto: z.string().optional().nullable(),
  homeUnit: z.string().optional().nullable(),
  homeBuilding: z.string().optional().nullable(),
  homeStreet: z.string().optional().nullable(),
  homeCity: z.string().optional().nullable(),
  homeState: z.string().optional().nullable(),
  homeCountry: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  jobIncome: z.string().optional().nullable(),
  jobOrganization: z.string().optional().nullable(),
  jobCountry: z.string().optional().nullable(),
  guardianName: z.string().optional().nullable(),
  guardianMobile: z.string().optional().nullable(),
  guardianEmail: z.string().optional().nullable(),
  guardianResidence: z.string().optional().nullable(),
  guardianIncome: z.nativeEnum(IncomeLevel).optional().nullable(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface EditUserDialogProps {
  user: any;
}

export function EditUserDialog({ user }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const result = await deleteUser(user.id);
      if (result.success) {
        toast.success("User deleted successfully");
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || Role.USER,
      tier: user.tier || SubscriptionTier.BASIC,
      firstName: user.firstName || "",
      fatherName: user.fatherName || "",
      grandfatherName: user.grandfatherName || "",
      familyName: user.familyName || "",
      nickname: user.nickname || "",
      photoUrl: user.photoUrl || "",
      sex: user.sex || null,
      birthDate: user.birthDate
        ? new Date(user.birthDate).toISOString().split("T")[0]
        : "",
      birthCountry: user.birthCountry || "",
      birthState: user.birthState || "",
      birthCity: user.birthCity || "",
      birthTown: user.birthTown || "",
      birthVillage: user.birthVillage || "",
      incomeLevel: user.incomeLevel || null,
      worldTier: user.worldTier || null,
      mobile1: user.mobile1 || "",
      mobile2: user.mobile2 || "",
      telephone: user.telephone || "",
      educationLevel: user.educationLevel || null,
      educationDegree: user.educationDegree || "",
      educationSchool: user.educationSchool || "",
      educationPhoto: user.educationPhoto || "",
      iqLevel: user.iqLevel || null,
      nationalityId: user.nationalityId || "",
      nationalityPhoto: user.nationalityPhoto || "",
      residenceState: user.residenceState || "",
      residenceCity: user.residenceCity || "",
      residenceTown: user.residenceTown || "",
      residenceNo: user.residenceNo || "",
      residencePhoto: user.residencePhoto || "",
      homeUnit: user.homeUnit || "",
      homeBuilding: user.homeBuilding || "",
      homeStreet: user.homeStreet || "",
      homeCity: user.homeCity || "",
      homeState: user.homeState || "",
      homeCountry: user.homeCountry || "",
      jobTitle: user.jobTitle || "",
      jobIncome: user.jobIncome || "",
      jobOrganization: user.jobOrganization || "",
      jobCountry: user.jobCountry || "",
      guardianName: user.guardianName || "",
      guardianMobile: user.guardianMobile || "",
      guardianEmail: user.guardianEmail || "",
      guardianResidence: user.guardianResidence || "",
      guardianIncome: user.guardianIncome || null,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || Role.USER,
        tier: user.tier || SubscriptionTier.BASIC,
        firstName: user.firstName || "",
        fatherName: user.fatherName || "",
        grandfatherName: user.grandfatherName || "",
        familyName: user.familyName || "",
        nickname: user.nickname || "",
        photoUrl: user.photoUrl || "",
        sex: user.sex || null,
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        birthCountry: user.birthCountry || "",
        birthState: user.birthState || "",
        birthCity: user.birthCity || "",
        birthTown: user.birthTown || "",
        birthVillage: user.birthVillage || "",
        incomeLevel: user.incomeLevel || null,
        worldTier: user.worldTier || null,
        mobile1: user.mobile1 || "",
        mobile2: user.mobile2 || "",
        telephone: user.telephone || "",
        educationLevel: user.educationLevel || null,
        educationDegree: user.educationDegree || "",
        educationSchool: user.educationSchool || "",
        educationPhoto: user.educationPhoto || "",
        iqLevel: user.iqLevel || null,
        nationalityId: user.nationalityId || "",
        nationalityPhoto: user.nationalityPhoto || "",
        residenceState: user.residenceState || "",
        residenceCity: user.residenceCity || "",
        residenceTown: user.residenceTown || "",
        residenceNo: user.residenceNo || "",
        residencePhoto: user.residencePhoto || "",
        homeUnit: user.homeUnit || "",
        homeBuilding: user.homeBuilding || "",
        homeStreet: user.homeStreet || "",
        homeCity: user.homeCity || "",
        homeState: user.homeState || "",
        homeCountry: user.homeCountry || "",
        jobTitle: user.jobTitle || "",
        jobIncome: user.jobIncome || "",
        jobOrganization: user.jobOrganization || "",
        jobCountry: user.jobCountry || "",
        guardianName: user.guardianName || "",
        guardianMobile: user.guardianMobile || "",
        guardianEmail: user.guardianEmail || "",
        guardianResidence: user.guardianResidence || "",
        guardianIncome: user.guardianIncome || null,
      });
    }
  }, [user, open, form]);

  async function onSubmit(data: UserFormValues) {
    setLoading(true);
    try {
      const cleanedData = { ...data };
      // Convert empty strings to null or omit
      Object.keys(cleanedData).forEach((key) => {
        if ((cleanedData as any)[key] === "") {
          (cleanedData as any)[key] = null;
        }
      });

      const result = await updateUser(user.id, cleanedData);
      if (result.success) {
        toast.success("User profile updated successfully");
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to update user profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
      >
        Edit
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between bg-white dark:bg-slate-950 shadow-2xl">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-2xl font-black flex items-center gap-2">
              <User className="text-primary w-6 h-6 animate-pulse" />
              Edit User Profile
            </DialogTitle>
            <DialogDescription>
              Update comprehensive personal, academic, financial and
              localization data.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex-grow overflow-hidden flex flex-col my-4"
            >
              <Tabs
                defaultValue="core"
                className="w-full flex-grow flex flex-col overflow-hidden"
              >
                <TabsList className="grid grid-cols-5 w-full bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shrink-0">
                  <TabsTrigger
                    value="core"
                    className="rounded-lg text-xs font-semibold"
                  >
                    Core Auth
                  </TabsTrigger>
                  <TabsTrigger
                    value="personal"
                    className="rounded-lg text-xs font-semibold"
                  >
                    Personal
                  </TabsTrigger>
                  <TabsTrigger
                    value="contact"
                    className="rounded-lg text-xs font-semibold"
                  >
                    Address
                  </TabsTrigger>
                  <TabsTrigger
                    value="academic"
                    className="rounded-lg text-xs font-semibold"
                  >
                    Academic
                  </TabsTrigger>
                  <TabsTrigger
                    value="guardian"
                    className="rounded-lg text-xs font-semibold"
                  >
                    Guardian
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-grow pr-3 mt-4 h-[420px]">
                  {/* Core Auth & System Roles */}
                  <TabsContent value="core" className="space-y-4 mt-0">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Public Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="john@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>System Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={Role.USER}>User</SelectItem>
                                <SelectItem value={Role.INSTRUCTOR}>
                                  Instructor
                                </SelectItem>
                                <SelectItem value={Role.ADMIN}>
                                  Admin
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subscription Access</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? (undefined as any)}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Select tier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={SubscriptionTier.BASIC}>
                                  Basic
                                </SelectItem>
                                <SelectItem value={SubscriptionTier.PRO}>
                                  Pro
                                </SelectItem>
                                <SelectItem value={SubscriptionTier.ENTERPRISE}>
                                  Enterprise
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="•••••• (optional)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-[10px]">
                              Omit to preserve current password.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Personal & Demographic */}
                  <TabsContent value="personal" className="space-y-4 mt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="First"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fatherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Father Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Father"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="grandfatherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>G. Father Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Grandfather"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="familyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Family Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Family"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="nickname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nickname</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nickname"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sex</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? (undefined as any)}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Select sex" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={Sex.MALE}>Male</SelectItem>
                                <SelectItem value={Sex.FEMALE}>
                                  Female
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Birth Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Birth Origin
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <FormField
                          control={form.control}
                          name="birthCountry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                Country
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Country"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="birthState"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                State
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="State"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="birthCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                City
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="City"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="birthTown"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                Town
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Town"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="birthVillage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                Village
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Village"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Location, Residence & Contacts */}
                  <TabsContent value="contact" className="space-y-4 mt-0">
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="mobile1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile 1</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+1..."
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mobile2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile 2</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+1..."
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telephone</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+1..."
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Residence Address
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <FormField
                          control={form.control}
                          name="homeCountry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                Country
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Country"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="homeState"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                State
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="State"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="homeCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                City
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="City"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="homeStreet"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                Street
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Street"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-1">
                        <FormField
                          control={form.control}
                          name="homeBuilding"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                Building No
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Building"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="homeUnit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                Unit No
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Unit"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="residenceNo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px]">
                                Contract/House ID
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ID No"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Academics & Financial & Tiers */}
                  <TabsContent value="academic" className="space-y-4 mt-0">
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="educationLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? (undefined as any)}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={EducationLevel.DEGREE}>
                                  University Degree
                                </SelectItem>
                                <SelectItem value={EducationLevel.CLASS}>
                                  Secondary School
                                </SelectItem>
                                <SelectItem value={EducationLevel.SCHOOL}>
                                  Elementary School
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="educationDegree"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Degree Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. B.Sc. Logic"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="educationSchool"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution/School</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Oxford University"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 border-t pt-4">
                      <FormField
                        control={form.control}
                        name="iqLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aptitude / IQ Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? (undefined as any)}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Select IQ" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={IQLevel.GENIUS}>
                                  Superior / Genius
                                </SelectItem>
                                <SelectItem value={IQLevel.GIFTED}>
                                  Highly Gifted
                                </SelectItem>
                                <SelectItem value={IQLevel.TALENTED}>
                                  Talented
                                </SelectItem>
                                <SelectItem value={IQLevel.AVERAGE}>
                                  Normal / Average
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="incomeLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Financial Income</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? (undefined as any)}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Select income" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={IncomeLevel.HIGH}>
                                  High Income
                                </SelectItem>
                                <SelectItem value={IncomeLevel.MEDIUM}>
                                  Medium Income
                                </SelectItem>
                                <SelectItem value={IncomeLevel.LOW}>
                                  Low Income
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="worldTier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Geographic economic tier</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? (undefined as any)}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Select tier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={WorldTier.FIRST}>
                                  First Tier (Developed)
                                </SelectItem>
                                <SelectItem value={WorldTier.SECOND}>
                                  Second Tier (Developing)
                                </SelectItem>
                                <SelectItem value={WorldTier.THIRD}>
                                  Third Tier (Underdeveloped)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Software Engineer"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jobOrganization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="NASA"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Guardian Details */}
                  <TabsContent value="guardian" className="space-y-4 mt-0">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="guardianName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guardian Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Guardian Full Name"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guardianEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guardian Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="guardian@example.com"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="guardianMobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guardian Mobile</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+1..."
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guardianIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guardian Income Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? (undefined as any)}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Select income" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={IncomeLevel.HIGH}>
                                  High Income
                                </SelectItem>
                                <SelectItem value={IncomeLevel.MEDIUM}>
                                  Medium Income
                                </SelectItem>
                                <SelectItem value={IncomeLevel.LOW}>
                                  Low Income
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>

              <DialogFooter className="pt-4 border-t shrink-0 flex justify-between items-center w-full gap-3">
                <Button
                  type="button"
                  variant={confirmDelete ? "destructive" : "outline"}
                  onClick={handleDelete}
                  disabled={loading || deleting}
                  className={`rounded-xl shadow-sm text-xs font-semibold ${
                    !confirmDelete
                      ? "text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      : ""
                  }`}
                >
                  {deleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {confirmDelete ? "Confirm Delete?" : "Delete Member"}
                </Button>
                <div className="flex gap-2 sm:ml-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setOpen(false);
                      setConfirmDelete(false);
                    }}
                    className="w-full sm:w-auto rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || deleting}
                    className="w-full sm:w-auto bg-primary text-white rounded-xl shadow-md min-w-[125px]"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Save Profile
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
