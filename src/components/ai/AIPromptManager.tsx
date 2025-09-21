import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, Copy, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIPromptTemplate } from "@/types/ai";
import { mockPromptTemplates } from "@/lib/ai-mock-data";
import { toast } from "sonner";

interface AIPromptManagerProps {
  isPreview?: boolean;
}

export function AIPromptManager({ isPreview = false }: AIPromptManagerProps) {
  const [templates, setTemplates] =
    useState<AIPromptTemplate[]>(mockPromptTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<AIPromptTemplate | null>(null);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryColors = {
    marketing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "customer-service":
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    sales:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    content:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  const handleUseTemplate = (template: AIPromptTemplate) => {
    if (isPreview) return;

    toast(`Prompt "${template.name}" telah disalin ke AI chat`);
  };

  const handleCopyTemplate = (template: AIPromptTemplate) => {
    if (isPreview) return;

    navigator.clipboard.writeText(template.prompt);
    toast("Prompt telah disalin ke clipboard");
  };

  const handleDeleteTemplate = (id: string) => {
    if (isPreview) return;

    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast("Template prompt telah dihapus");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Template Prompt AI</h2>
          <p className="text-muted-foreground">
            Kelola dan gunakan template prompt untuk berbagai kebutuhan
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isPreview} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Edit Template" : "Tambah Template Baru"}
              </DialogTitle>
            </DialogHeader>
            {/* Form content would go here */}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Template</Label>
                <Input
                  placeholder="Masukkan nama template"
                  disabled={isPreview}
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select disabled={isPreview}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="customer-service">
                      Customer Service
                    </SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Input
                  placeholder="Jelaskan fungsi template"
                  disabled={isPreview}
                />
              </div>
              <div className="space-y-2">
                <Label>Prompt</Label>
                <Textarea
                  placeholder="Masukkan prompt template dengan variabel {seperti_ini}"
                  className="min-h-[120px]"
                  disabled={isPreview}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari template..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            disabled={isPreview}
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          disabled={isPreview}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="customer-service">Customer Service</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="content">Content</SelectItem>
            <SelectItem value="other">Lainnya</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </div>
                <Badge className={categoryColors[template.category]}>
                  {template.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Prompt Preview */}
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {template.prompt}
                </p>
              </div>

              {/* Variables */}
              {template.variables && template.variables.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Variabel:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable) => (
                      <Badge
                        key={variable}
                        variant="outline"
                        className="text-xs"
                      >
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleUseTemplate(template)}
                  disabled={isPreview}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Gunakan
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyTemplate(template)}
                  disabled={isPreview}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingTemplate(template)}
                  disabled={isPreview}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteTemplate(template.id)}
                  disabled={isPreview}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Meta Info */}
              <div className="text-xs text-muted-foreground">
                {template.lastUsed
                  ? `Terakhir digunakan: ${new Date(
                      template.lastUsed
                    ).toLocaleDateString("id-ID")}`
                  : "Belum pernah digunakan"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Tidak ada template yang ditemukan
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
      )}
    </div>
  );
}
