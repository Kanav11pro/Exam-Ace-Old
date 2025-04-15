
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormulaSheet } from './formula-sheet/hooks/useFormulaSheet';
import { PageHeader } from './formula-sheet/components/PageHeader';
import { FormulaSearch } from './formula-sheet/components/FormulaSearch';
import { AddFormulaDialog } from './formula-sheet/components/AddFormulaDialog';
import { 
  AllFormulasTab, 
  BookmarkedFormulasTab, 
  ImportantFormulasTab, 
  CustomFormulasTab 
} from './formula-sheet/components/TabContent';

export function FormulaSheet() {
  const {
    searchTerm,
    setSearchTerm,
    selectedSubject,
    setSelectedSubject,
    selectedChapter,
    setSelectedChapter,
    isAddFormulaOpen,
    setIsAddFormulaOpen,
    newFormula,
    setNewFormula,
    editingFormula,
    formulas,
    filteredFormulas,
    chapters,
    formulasBySubject,
    formulasByChapter,
    handleCopyFormula,
    handleToggleBookmark,
    handleToggleImportant,
    handleAddFormula,
    handleEditFormula,
    handleDeleteFormula,
    handleDownloadPDF,
    handleDialogChange
  } = useFormulaSheet();

  return (
    <div className="container max-w-5xl py-8 animate-fade-in">
      <PageHeader 
        onDownloadPDF={handleDownloadPDF} 
        onAddFormula={() => setIsAddFormulaOpen(true)} 
      />
      
      <FormulaSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedChapter={selectedChapter}
        onChapterChange={setSelectedChapter}
        chapters={chapters}
      />
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Formulas</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarked</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="custom">My Formulas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <AllFormulasTab 
            filteredFormulas={filteredFormulas}
            formulasBySubject={formulasBySubject}
            formulasByChapter={formulasByChapter}
            onToggleBookmark={handleToggleBookmark}
            onToggleImportant={handleToggleImportant}
            onCopyFormula={handleCopyFormula}
            onEditFormula={handleEditFormula}
            onDeleteFormula={handleDeleteFormula}
          />
        </TabsContent>
        
        <TabsContent value="bookmarks">
          <BookmarkedFormulasTab 
            formulas={formulas}
            onToggleBookmark={handleToggleBookmark}
            onCopyFormula={handleCopyFormula}
          />
        </TabsContent>
        
        <TabsContent value="important">
          <ImportantFormulasTab 
            filteredFormulas={filteredFormulas}
            onToggleBookmark={handleToggleBookmark}
            onCopyFormula={handleCopyFormula}
          />
        </TabsContent>
        
        <TabsContent value="custom">
          <CustomFormulasTab 
            formulas={formulas}
            onEditFormula={handleEditFormula}
            onDeleteFormula={handleDeleteFormula}
            onAddFormulaClick={() => setIsAddFormulaOpen(true)}
          />
        </TabsContent>
      </Tabs>
      
      <AddFormulaDialog 
        open={isAddFormulaOpen}
        onOpenChange={handleDialogChange}
        formula={newFormula}
        setFormula={setNewFormula}
        onAddFormula={handleAddFormula}
        isEditing={!!editingFormula}
      />
    </div>
  );
}

export default FormulaSheet;
