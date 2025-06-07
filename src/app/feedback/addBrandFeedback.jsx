import { useForm } from "react-hook-form";
import http_request from "../../../http-request";
import { useUser } from "../components/UserContext";
import { useEffect } from "react";

export default function BrandFeedbackForm({ onClose ,RefreshData}) {
  const { register, handleSubmit, reset, setValue } = useForm();

  const { user } = useUser()
  useEffect(() => {
    if (user) {
      setValue('brandName', user?.user?.brandName || "");
      setValue('brandId', user?.user?._id || ""); // assuming user.brandId exists
    }
  }, [user, setValue]);
  const onSubmit = async (data1) => {
    try {
      const res = await http_request.post("/submit-feedback", data1);
      //  const {data}=res;
      alert("Feedback submitted successfully!");
      reset();
      RefreshData(res)
      onClose()
    } catch (err) {
      console.error(err);
      onClose()
      alert("Failed to submit feedback");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-6">
      <h1 className="text-2xl font-bold">Servsy | Brand Feedback Form</h1>
      <p className="text-gray-600">Help us improve our service quality by sharing your honest feedback.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input {...register("brandName")} placeholder="Brand Name" className="border p-2 rounded" required />
        <input {...register("contactPerson")} placeholder="Contact Person" className="border p-2 rounded" required />
        <input {...register("designation")} placeholder="Designation" className="border p-2 rounded" required />
        <input {...register("phone")} placeholder="Phone / WhatsApp" className="border p-2 rounded" required />
        <input {...register("email")} placeholder="Email ID" className="border p-2 rounded" required />
      </div>

      <div>
        <h2 className="font-semibold text-lg">A. Overall Service Quality (1-5)</h2>
        {["installation", "repair", "sparePartHandling", "reverseLogistics", "technicalSupport"].map((field) => (
          <div key={field} className="space-x-2 mt-2">
            <label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}: </label>
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num}>
                <input type="radio" value={num} {...register(`serviceRatings.${field}`)} required /> {num}
              </label>
            ))}
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold text-lg">B. Timeliness & SLA Adherence</h2>
        <select {...register("timeliness")} className="border p-2 rounded mt-2">
          <option>Always</option>
          <option>Sometimes</option>
          <option>Rarely</option>
          <option>Never</option>
        </select>
      </div>

      <div>
        <h2 className="font-semibold text-lg">C. Customer Satisfaction Reports</h2>
        <select {...register("customerSatisfaction")} className="border p-2 rounded mt-2">
          <option>Yes</option>
          <option>No</option>
          <option>Sometimes</option>
        </select>
      </div>

      <textarea {...register("majorIssues")} placeholder="Major issues in last 30 days" className="border p-2 rounded w-full" rows={3} />
      <textarea {...register("unresolvedEscalations")} placeholder="Unresolved escalation points" className="border p-2 rounded w-full" rows={3} />
      <textarea {...register("improvementSuggestions")} placeholder="Suggestions for improvement" className="border p-2 rounded w-full" rows={3} />
      <textarea {...register("additionalComments")} placeholder="Additional comments" className="border p-2 rounded w-full" rows={3} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input {...register("authorizedPersonName")} placeholder="Authorized Person Name" className="border p-2 rounded" required />
        <input {...register("signature")} placeholder="Signature" className="border p-2 rounded" />
        <input {...register("date")} type="date" className="border p-2 rounded" required />
      </div>
      <div className="mt-4 flex justify-between  gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Feedback
        </button>
      </div>

    </form>
  );
}
