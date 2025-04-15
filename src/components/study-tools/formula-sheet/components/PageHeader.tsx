
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator, Download, Plus, ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  onDownloadPDF: () => void;
  onAddFormula: () => void;
}

export function PageHeader({ onDownloadPDF, onAddFormula }: PageHeaderProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Calculator className="h-7 w-7 text-blue-600" />
            Formula Sheet
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Quick reference for essential JEE formulas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={onDownloadPDF}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button className="flex items-center gap-2" onClick={onAddFormula}>
            <Plus className="h-4 w-4" />
            Add Formula
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <Button variant="ghost" className="flex items-center gap-2" asChild>
          <Link to="/tools">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
      </div>
    </>
  );
}
