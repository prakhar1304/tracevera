import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const projectData = [
  { name: 'Completed', value: 30 },
  { name: 'Ongoing', value: 50 },
  { name: 'Pending', value: 20 },
];

const projects = [
  { id: 1, name: 'Road Construction', status: 'Ongoing', location: 'Downtown' },
  { id: 2, name: 'Park Renovation', status: 'Completed', location: 'Uptown' },
  { id: 3, name: 'Bridge Repair', status: 'Pending', location: 'Riverside' },
];

export function CitizenHomeScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'All' || project.status === filter)
  );

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Statistics</h2>
          <p>Total Projects: {projects.length}</p>
          <p>Completed: {projectData[0].value}</p>
          <p>Ongoing: {projectData[1].value}</p>
          <p>Pending: {projectData[2].value}</p>
        </div>
      </div>
      
      <div className="mb-4 flex gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full p-2 pl-10 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <div className="relative">
          <select
            className="appearance-none bg-white border rounded p-2 pr-8"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Ongoing</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
          <Filter className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map(project => (
          <Link key={project.id} to={`/project/${project.id}`} className="block">
            <div className="border rounded p-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <p>Status: {project.status}</p>
              <p>Location: {project.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}