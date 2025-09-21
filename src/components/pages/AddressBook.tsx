"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  Edit2,
  Eye,
  Star,
  Building2,
  User,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppStore } from "@/stores/appStore";
import { Address } from "@/types";
import { mockAddresses } from "@/lib/mock-addresses";
import { AddressForm } from "@/components/address/AddressForm";
import { AddressDetail } from "@/components/address/AddressDetail";
import { toast } from "sonner";

export function AddressBook() {
  const { addresses, addAddress, updateAddress, removeAddress } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [businessFilter, setBusinessFilter] = useState<string>("all");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Initialize with mock data if empty
  useState(() => {
    if (addresses.length === 0) {
      mockAddresses.forEach((address) => addAddress(address));
    }
  });

  const filteredAddresses = useMemo(() => {
    return addresses.filter((address) => {
      const matchesSearch =
        address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.phoneNumber.includes(searchTerm) ||
        address.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || address.status === statusFilter;
      const matchesCity = cityFilter === "all" || address.city === cityFilter;
      const matchesBusiness =
        businessFilter === "all" ||
        (businessFilter === "business" && address.isBusiness) ||
        (businessFilter === "individual" && !address.isBusiness);

      return matchesSearch && matchesStatus && matchesCity && matchesBusiness;
    });
  }, [addresses, searchTerm, statusFilter, cityFilter, businessFilter]);

  const uniqueCities = useMemo(() => {
    const cities = addresses.map((addr) => addr.city).filter(Boolean);
    return Array.from(new Set(cities));
  }, [addresses]);

  const uniqueStatuses = useMemo(() => {
    const statuses = addresses.map((addr) => addr.status).filter(Boolean);
    return Array.from(new Set(statuses));
  }, [addresses]);

  const columns = [
    {
      key: "name" as keyof Address,
      header: "Nama",
      render: (value: string, address: Address) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              address.isBusiness ? "bg-primary/10 text-primary" : "bg-muted"
            }`}
          >
            {address.isBusiness ? (
              <Building2 className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div>
            <p className="font-medium">{value}</p>
            {address.businessName && address.businessName !== value && (
              <p className="text-xs text-muted-foreground">
                {address.businessName}
              </p>
            )}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "phoneNumber" as keyof Address,
      header: "Nomor HP",
      sortable: true,
    },
    {
      key: "email" as keyof Address,
      header: "Email",
      render: (value: string) => value || "-",
    },
    {
      key: "city" as keyof Address,
      header: "Kota",
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span>{value || "-"}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "rating" as keyof Address,
      header: "Rating",
      render: (value: number | null) =>
        value ? (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{value.toFixed(1)}</span>
          </div>
        ) : (
          "-"
        ),
      sortable: true,
    },
    {
      key: "status" as keyof Address,
      header: "Status",
      render: (value: string | null) =>
        value ? (
          <Badge
            variant={
              value === "VIP Customer"
                ? "default"
                : value === "Customer"
                ? "secondary"
                : value === "Lead"
                ? "outline"
                : "destructive"
            }
          >
            {value}
          </Badge>
        ) : (
          "-"
        ),
    },
    {
      key: "hasReceivedMessage" as keyof Address,
      header: "Pesan Terkirim",
      render: (value: boolean) => (
        <Badge variant={value ? "secondary" : "outline"}>
          {value ? "Ya" : "Tidak"}
        </Badge>
      ),
    },
    {
      key: "actions" as keyof Address,
      header: "Aksi",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, address: Address) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedAddress(address);
              setIsDetailOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingAddress(address);
              setIsFormOpen(true);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              removeAddress(address.id);
              toast.success("Kontak berhasil dihapus");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleAddAddress = (addressData: Partial<Address>) => {
    const newAddress: Address = {
      ...addressData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address;

    addAddress(newAddress);
    setIsFormOpen(false);
    toast.success("Kontak berhasil ditambahkan");
  };

  const handleUpdateAddress = (addressData: Partial<Address>) => {
    if (!editingAddress) return;

    updateAddress(editingAddress.id, {
      ...addressData,
      updatedAt: new Date().toISOString(),
    });
    setIsFormOpen(false);
    setEditingAddress(null);
    toast.success("Kontak berhasil diperbarui");
  };

  const handleExportCSV = () => {
    const headers = [
      "Nama",
      "Nomor HP",
      "Email",
      "Alamat",
      "Kota",
      "Status",
      "Rating",
    ];
    const csvData = [
      headers.join(","),
      ...filteredAddresses.map((addr) =>
        [
          addr.name,
          addr.phoneNumber,
          addr.email || "",
          addr.address,
          addr.city || "",
          addr.status || "",
          addr.rating || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kontak.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Data berhasil diekspor");
  };

  if (addresses.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={User}
          title="Belum ada kontak"
          description="Mulai dengan menambahkan kontak pertama Anda atau impor data dari file CSV."
          action={{
            label: "Tambah Kontak",
            onClick: () => setIsFormOpen(true),
          }}
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Kontak Baru</DialogTitle>
            </DialogHeader>
            <AddressForm onSubmit={handleAddAddress} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Buku Alamat</h1>
          <p className="text-muted-foreground">
            Kelola kontak dan data pelanggan Anda
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Ekspor
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Impor
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingAddress(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kontak
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? "Edit Kontak" : "Tambah Kontak Baru"}
                </DialogTitle>
              </DialogHeader>
              <AddressForm
                initialData={editingAddress}
                onSubmit={
                  editingAddress ? handleUpdateAddress : handleAddAddress
                }
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Kontak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{addresses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Kontak Bisnis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addresses.filter((addr) => addr.isBusiness).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Sudah Dihubungi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addresses.filter((addr) => addr.hasReceivedMessage).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addresses.filter((addr) => addr.rating).length > 0
                ? (
                    addresses
                      .filter((addr) => addr.rating)
                      .reduce((sum, addr) => sum + (addr.rating || 0), 0) /
                    addresses.filter((addr) => addr.rating).length
                  ).toFixed(1)
                : "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, nomor HP, atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status!}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Kota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kota</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city!}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={businessFilter} onValueChange={setBusinessFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="business">Bisnis</SelectItem>
                <SelectItem value="individual">Individu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={filteredAddresses}
            columns={columns}
            searchable={false}
            paginated={true}
            pageSize={10}
            emptyMessage="Tidak ada kontak yang ditemukan"
          />
        </CardContent>
      </Card>

      {/* Address Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Kontak</DialogTitle>
          </DialogHeader>
          {selectedAddress && (
            <AddressDetail
              address={selectedAddress}
              onEdit={() => {
                setEditingAddress(selectedAddress);
                setIsDetailOpen(false);
                setIsFormOpen(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
