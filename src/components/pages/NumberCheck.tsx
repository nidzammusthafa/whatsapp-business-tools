"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  Upload,
  Download,
  Search,
  Phone,
  AlertTriangle,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { mockNumberChecks } from "@/lib/dummy-data";

export default function NumberCheck() {
  const [numbers, setNumbers] = useState(mockNumberChecks);
  const [singleNumber, setSingleNumber] = useState("");
  const [bulkNumbers, setBulkNumbers] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleSingleCheck = async () => {
    if (!singleNumber.trim()) return;

    setIsChecking(true);

    // Simulate API call
    setTimeout(() => {
      const newCheck = {
        phoneNumber: singleNumber,
        isValid: Math.random() > 0.2, // 80% valid
        hasWhatsApp: Math.random() > 0.3, // 70% have WhatsApp
        lastChecked: new Date().toISOString(),
        profilePicture:
          Math.random() > 0.5
            ? "https://images.unsplash.com/photo-1494790108755-2616b619639a?w=150"
            : undefined,
        about:
          Math.random() > 0.7 ? "Hey there! I am using WhatsApp." : undefined,
        error: Math.random() > 0.8 ? "Number not in service" : undefined,
      };

      setNumbers([newCheck, ...numbers]);
      setSingleNumber("");
      setIsChecking(false);
    }, 2000);
  };

  const handleBulkCheck = async () => {
    if (!bulkNumbers.trim()) return;

    const numberList = bulkNumbers.split("\n").filter((n) => n.trim());
    if (numberList.length === 0) return;

    setIsChecking(true);

    // Simulate bulk checking
    setTimeout(() => {
      const newChecks = numberList.map((number) => ({
        phoneNumber: number.trim(),
        isValid: Math.random() > 0.2,
        hasWhatsApp: Math.random() > 0.3,
        lastChecked: new Date().toISOString(),
        profilePicture:
          Math.random() > 0.5
            ? "https://images.unsplash.com/photo-1494790108755-2616b619639a?w=150"
            : undefined,
        about:
          Math.random() > 0.7 ? "Hey there! I am using WhatsApp." : undefined,
        error: Math.random() > 0.8 ? "Invalid format" : undefined,
      }));

      setNumbers([...newChecks, ...numbers]);
      setBulkNumbers("");
      setIsChecking(false);
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would parse the CSV/Excel file here
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split("\n").slice(1); // Skip header
        const numbersFromFile = lines
          .map((line) => line.split(",")[0])
          .filter((number) => number && number.trim());
        setBulkNumbers(numbersFromFile.join("\n"));
      };
      reader.readAsText(file);
    }
  };

  const exportResults = () => {
    const csvContent = [
      "Phone Number,Valid,Has WhatsApp,Last Checked,Error",
      ...numbers.map(
        (n) =>
          `${n.phoneNumber},${n.isValid},${n.hasWhatsApp},${n.lastChecked},${
            n.error || ""
          }`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "number-check-results.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const validCount = numbers.filter((n) => n.isValid).length;
  const whatsappCount = numbers.filter((n) => n.hasWhatsApp).length;
  const errorCount = numbers.filter((n) => n.error).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Number Check</h1>
          <p className="text-muted-foreground">
            Verify phone numbers and check WhatsApp availability
          </p>
        </div>
        {numbers.length > 0 && (
          <Button variant="outline" onClick={exportResults}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checked</CardTitle>
            <Phone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numbers.length}</div>
            <p className="text-xs text-muted-foreground">Numbers verified</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid Numbers</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validCount}</div>
            <p className="text-xs text-muted-foreground">
              {numbers.length > 0
                ? Math.round((validCount / numbers.length) * 100)
                : 0}
              % success rate
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              WhatsApp Active
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{whatsappCount}</div>
            <p className="text-xs text-muted-foreground">
              {validCount > 0
                ? Math.round((whatsappCount / validCount) * 100)
                : 0}
              % of valid
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorCount}</div>
            <p className="text-xs text-muted-foreground">
              {numbers.length > 0
                ? Math.round((errorCount / numbers.length) * 100)
                : 0}
              % failed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Check Interface */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Single Number Check */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Single Number Check
            </CardTitle>
            <CardDescription>
              Check individual phone numbers quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="single-number">Phone Number</Label>
              <Input
                id="single-number"
                type="tel"
                value={singleNumber}
                onChange={(e) => setSingleNumber(e.target.value)}
                placeholder="+62812345678910"
                disabled={isChecking}
              />
              <p className="text-xs text-muted-foreground">
                Include country code (e.g. +62 for Indonesia)
              </p>
            </div>

            <Button
              onClick={handleSingleCheck}
              disabled={!singleNumber.trim() || isChecking}
              className="w-full gradient-primary"
            >
              {isChecking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check Number
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Bulk Number Check */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-accent" />
              Bulk Number Check
            </CardTitle>
            <CardDescription>Check multiple numbers at once</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-numbers">Phone Numbers</Label>
              <Textarea
                id="bulk-numbers"
                value={bulkNumbers}
                onChange={(e) => setBulkNumbers(e.target.value)}
                placeholder="+6281234567890&#10;+6281234567891&#10;+6281234567892"
                rows={5}
                disabled={isChecking}
              />
              <p className="text-xs text-muted-foreground">
                Enter one number per line or upload a CSV file
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload CSV File</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isChecking}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload CSV file
                  </p>
                </label>
              </div>
            </div>

            <Button
              onClick={handleBulkCheck}
              disabled={!bulkNumbers.trim() || isChecking}
              className="w-full gradient-accent"
            >
              {isChecking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking Numbers...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check All Numbers
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      {numbers.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Check Results
            </CardTitle>
            <CardDescription>
              Recent number verification results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Profile</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {numbers.slice(0, 10).map((number, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {number.phoneNumber}
                      </TableCell>
                      <TableCell>
                        {number.isValid ? (
                          <Badge className="status-online">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Invalid
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {number.hasWhatsApp ? (
                          <Badge
                            variant="outline"
                            className="text-success border-success"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            Not Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {number.profilePicture ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={number.profilePicture} />
                              <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {number.about ? "Has status" : "No status"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No profile
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(number.lastChecked).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {number.error ? (
                          <div className="flex items-center gap-1 text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-xs">{number.error}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {numbers.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Showing 10 of {numbers.length} results. Export to see all
                  results.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
