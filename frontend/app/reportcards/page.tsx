import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";

const subjects = ["Mathematics", "English", "Science", "History", "Geography", "Physics", "Chemistry", "Civics", "French", "Computer Science"];

export default function ReportCardsPage() {
  return (
    <AppShell>
      <Card>
        <h2 className="mb-4 text-xl font-black">Five-bimester report card</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left dark:border-white/10">
                {["Subject", "Test", "Exam", "Average", "Coeff", "Weighted", "Mention", "Remark"].map((heading) => (
                  <th key={heading} className="p-3">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={subject} className="border-b border-black/5 dark:border-white/10">
                  <td className="p-3 font-semibold">{subject}</td>
                  <td className="p-3">{14 + (index % 4)}</td>
                  <td className="p-3">{13 + (index % 5)}</td>
                  <td className="p-3">{14.2 + index / 10}</td>
                  <td className="p-3">{index < 3 ? 4 : 2}</td>
                  <td className="p-3">{42 + index}</td>
                  <td className="p-3">B+</td>
                  <td className="p-3">Consistent progress</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}

