// CompliancePolicies.jsx

const CompliancePolicies = () => {
  const policies = [
    { title: "Code of Conduct", link: "#" },
    { title: "Anti-Harassment Policy", link: "#" },
    { title: "Health and Safety Regulations", link: "#" },
    { title: "Data Protection Policy", link: "#" },
  ];

  return (
    <div className="p-4 md:ml-64 pt-24">
      <h2 className="text-2xl font-bold mb-4">Compliance and Policies</h2>

      <ul className="list-disc pl-5">
        {policies.map((policy, index) => (
          <li key={index} className="mb-2">
            <a href={policy.link} className="text-blue-500 hover:underline">
              {policy.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompliancePolicies;
