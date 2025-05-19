import ReportLayout from "../components/ReportLayout";

const DraftsPage = () => {
  return (
    <ReportLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Saved Drafts</h2>
      <p className="text-gray-600">You currently have no saved drafts.</p>
    </ReportLayout>
  );
};

export default DraftsPage;
