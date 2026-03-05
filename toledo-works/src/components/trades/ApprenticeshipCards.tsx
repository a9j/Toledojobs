import { GraduationCap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Program {
  name: string;
  description: string;
  url: string;
}

const PROGRAMS: Program[] = [
  {
    name: 'The Mona K Project',
    description:
      'Green Trades Workforce Academy offering training in solar installation, weatherization, and sustainable building practices for Toledo residents.',
    url: 'https://themonakproject.org',
  },
  {
    name: 'IBEW Local 8',
    description:
      'Electrical apprenticeship program providing classroom instruction and on-the-job training for aspiring electricians in northwest Ohio.',
    url: 'https://ibew8.org',
  },
  {
    name: 'UA Local 50',
    description:
      'Plumbers and pipefitters apprenticeship with comprehensive five-year training in plumbing, pipefitting, and HVAC systems.',
    url: 'https://ualocal50.com',
  },
  {
    name: 'Ironworkers Local 55',
    description:
      'Structural and reinforcing ironworker apprenticeship with training in welding, rigging, and structural steel erection.',
    url: 'https://ironworkers55.com',
  },
  {
    name: 'Carpenters Local 351',
    description:
      'Carpentry apprenticeship covering rough and finish carpentry, concrete formwork, and drywall installation.',
    url: 'https://carpenters351.org',
  },
  {
    name: 'Owens Community College',
    description:
      'Skilled trades certificate and associate degree programs in welding, HVAC, electrical, and advanced manufacturing.',
    url: 'https://owens.edu',
  },
  {
    name: 'OhioMeansJobs WIOA',
    description:
      'Workforce Innovation and Opportunity Act funding for trade training, certifications, and supportive services for eligible job seekers.',
    url: 'https://ohiomeansjobs.ohio.gov',
  },
];

export default function ApprenticeshipCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {PROGRAMS.map((program) => (
        <Card key={program.name} className="flex flex-col bg-navy-800 border-navy-700 p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
              <GraduationCap className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="text-white font-bold text-base leading-tight pt-1">
              {program.name}
            </h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
            {program.description}
          </p>
          <a href={program.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="w-full">
              Learn More
            </Button>
          </a>
        </Card>
      ))}
    </div>
  );
}
