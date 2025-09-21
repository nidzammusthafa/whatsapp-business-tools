"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Address } from "@/types";

const addressSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phoneNumber: z.string().min(1, "Nomor HP wajib diisi"),
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Alamat wajib diisi"),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  website: z
    .string()
    .url("Format URL tidak valid")
    .optional()
    .or(z.literal("")),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().min(0).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: z.string().optional(),
  isBusiness: z.boolean(),
  businessName: z.string().optional(),
  businessCategory: z.string().optional(),
  hasReceivedMessage: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  initialData?: Address | null;
  onSubmit: (data: Partial<Address>) => void;
}

const statusOptions = [
  "Lead",
  "Prospect",
  "Customer",
  "VIP Customer",
  "Inactive",
];

const businessCategories = [
  "Teknologi Informasi",
  "Perdagangan",
  "Konstruksi",
  "Elektronik",
  "Makanan & Minuman",
  "Fashion",
  "Otomotif",
  "Kesehatan",
  "Pendidikan",
  "Keuangan",
  "Lainnya",
];

export function AddressForm({ initialData, onSubmit }: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: initialData?.name || "",
      phoneNumber: initialData?.phoneNumber || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      country: initialData?.country || "Indonesia",
      postalCode: initialData?.postalCode || "",
      website: initialData?.website || "",
      rating: initialData?.rating || undefined,
      reviews: initialData?.reviews || undefined,
      latitude: initialData?.latitude || undefined,
      longitude: initialData?.longitude || undefined,
      status: initialData?.status || "",
      isBusiness: initialData?.isBusiness || false,
      businessName: initialData?.businessName || "",
      businessCategory: initialData?.businessCategory || "",
      hasReceivedMessage: initialData?.hasReceivedMessage || false,
    },
  });

  const { watch } = form;
  const isBusiness = watch("isBusiness");

  const handleSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);
    try {
      // Clean up empty strings to null for optional fields
      const cleanedData = {
        ...data,
        email: data.email || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || null,
        postalCode: data.postalCode || null,
        website: data.website || null,
        status: data.status || null,
        businessName: data.businessName || null,
        businessCategory: data.businessCategory || null,
      };

      onSubmit(cleanedData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama *</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor HP *</FormLabel>
                    <FormControl>
                      <Input placeholder="+6281234567890" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan alamat lengkap"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Lokasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kota</FormLabel>
                    <FormControl>
                      <Input placeholder="Jakarta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provinsi</FormLabel>
                    <FormControl>
                      <Input placeholder="DKI Jakarta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Negara</FormLabel>
                    <FormControl>
                      <Input placeholder="Indonesia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Pos</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Bisnis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="isBusiness"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Akun Bisnis</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isBusiness && (
                <>
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Bisnis</FormLabel>
                        <FormControl>
                          <Input placeholder="PT. Contoh Bisnis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori Bisnis</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businessCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Tambahan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          placeholder="4.5"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reviews"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Reviews</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="hasReceivedMessage"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Pernah Dihubungi</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : initialData
              ? "Update Kontak"
              : "Simpan Kontak"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
