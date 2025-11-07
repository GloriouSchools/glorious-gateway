import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { ExportControls } from "@/components/electoral/dashboard/ExportControls";
import { ExportFormat } from "@/utils/exportUtils";

interface StudentsActionsProps {
  totalCount: number;
  filteredCount: number;
  onExportCSV: () => void;
  onPrint: () => void;
  isPrinting: boolean;
  onExport?: (format: ExportFormat) => void;
}

export function StudentsActions({
  totalCount,
  filteredCount,
  onExportCSV,
  onPrint,
  isPrinting,
  onExport
}: StudentsActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Students List</h1>
        <p className="text-muted-foreground">
          {filteredCount === totalCount 
            ? `Total: ${totalCount} students` 
            : `Showing: ${filteredCount} of ${totalCount} students`
          }
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        {onExport ? (
          <ExportControls onExport={(format) => {
            if (format === 'print') {
              onPrint();
            } else {
              onExport(format as ExportFormat);
            }
          }} />
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={onExportCSV}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={onPrint} 
              disabled={isPrinting}
              className="w-full sm:w-auto"
            >
              {isPrinting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              {isPrinting ? 'Generating...' : 'Print Report'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}