type ViewTechnicianFormProps = {
  selectedRow: {
    id: string;
    fullname: string;
    role: string;
    created_at: string;
  };
};

export default function ViewTechnicianForm({
  selectedRow,
}: ViewTechnicianFormProps) {
  return (
    <>
      <div className="space-y-2 p-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">ID</span>
          <span className="text-sm">{selectedRow.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Email</span>
          <span className="text-sm">{selectedRow.fullname}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Role</span>
          <span className="text-sm">{selectedRow.role}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Date Created</span>
          <span className="text-sm capitalize">{selectedRow.created_at}</span>
        </div>
      </div>
    </>
  );
}
