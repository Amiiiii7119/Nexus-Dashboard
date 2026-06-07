"use client";
import { useEffect, useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";
import type { FileCategory } from "@/types/erp";

export default function FilesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<FileCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getFileCategories().then((res) => {
      setCategories(res.categories ?? []);
      if (res.categories?.length > 0) {
        setSelectedCategory(res.categories[0].key);
      }
    }).catch(() => {});
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("categories", selectedCategory);
      formData.append("project_description", "Uploaded via Nexus ERP");
      files.forEach((f) => formData.append("files", f));
      const res = await api.uploadFiles(formData);
      setResult(res);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const currentCategory = categories.find((c) => c.key === selectedCategory);

  return (
    <AppShell>
      <PageHeader
        title="File Uploads"
        description="Submit files to your project workspace"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardBody className="space-y-6">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm text-white focus:outline-none focus:border-sky-500/50"
                >
                  {categories.map((cat) => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-sky-500/30 hover:bg-sky-500/5 transition-all"
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-300">Click to select files or drag and drop</p>
                {currentCategory && (
                  <p className="text-xs text-gray-500 mt-2">
                    Max {currentCategory.maxSizeMB}MB per file
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Selected Files</p>
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <FileText className="h-4 w-4 text-sky-400" />
                      <span className="text-sm text-white flex-1">{f.name}</span>
                      <span className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-md">{error}</p>
              )}

              {result && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Upload Results</p>
                  {result.files?.map((f: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      {f.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-sm text-white flex-1">{f.originalName}</span>
                      <Badge tone={f.status === "success" ? "success" : "danger"}>{f.status}</Badge>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={handleUpload} disabled={files.length === 0 || uploading} className="w-full">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <div className="p-5 border-b border-white/5">
              <h3 className="text-base font-semibold text-white">Categories</h3>
            </div>
            <CardBody className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.key}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedCategory === cat.key
                      ? "bg-sky-500/10 border-sky-500/30"
                      : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  <p className="text-sm font-medium text-white">{cat.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Max {cat.maxSizeMB}MB</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
