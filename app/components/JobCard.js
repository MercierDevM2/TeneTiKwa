export default function JobCard({ job }) {
  return (
    <div className="border rounded-xl p-4 shadow-md hover:shadow-lg transition">
      
      <h2 className="text-xl font-bold text-gray-800">
        {job.title}
      </h2>

      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location}</p>

      <a
        href={job.link}
        target="_blank"
        className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Postuler
      </a>
      
    </div>
  );
}