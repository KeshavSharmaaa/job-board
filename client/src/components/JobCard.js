import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
      
      <h2 className="text-xl font-semibold mb-2 text-indigo-600">
        {job.title}
      </h2>

      <p className="text-gray-600">{job.company}</p>
      <p className="text-gray-500 mb-4">{job.location}</p>

      <Link
        to={`/jobs/${job._id}`}
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        View Details
      </Link>
    </div>
  );
}

export default JobCard;
