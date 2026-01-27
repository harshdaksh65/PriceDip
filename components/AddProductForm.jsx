"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader, Loader2 } from "lucide-react";

function AddProductForm({ user }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handlesubmit = async (e) => {};

  return (
    <>
        <form onSubmit={handlesubmit} className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2 ">
            <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste product URL (Amazon, Walmart, etc.)"
            className="h-12 text-base"
            required
            disabled={loading}
            />

            <Button
            className="h-10 sm:h-12 px-8 bg-background text-text hover:bg-primary/50 "
            type="submit"
            disabled={loading}
            size="lg"
            >
            {loading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
                </>
            ) : (
                "Track Price"
            )}
            </Button>
        </div>
        </form>
    </>
  );
}

export default AddProductForm;
