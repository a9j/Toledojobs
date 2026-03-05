import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Globe, Phone, MapPin, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCompany, useCreateCompany, useUpdateCompany } from '../../hooks/useCompany';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

const INDUSTRY_OPTIONS = [
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Logistics', label: 'Logistics / Warehousing' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Food Service', label: 'Food Service / Restaurant' },
  { value: 'Education', label: 'Education' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Staffing', label: 'Staffing Agency' },
  { value: 'Other', label: 'Other' },
];

interface FormState {
  company_name: string;
  industry: string;
  description: string;
  website: string;
  phone: string;
  address: string;
  zip_code: string;
}

export default function CompanyProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: company, isLoading } = useCompany(user?.id);
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const isEditing = !!company;

  const [form, setForm] = useState<FormState>({
    company_name: '',
    industry: '',
    description: '',
    website: '',
    phone: '',
    address: '',
    zip_code: '',
  });

  useEffect(() => {
    if (company) {
      setForm({
        company_name: company.company_name ?? '',
        industry: company.industry ?? '',
        description: company.description ?? '',
        website: company.website ?? '',
        phone: company.phone ?? '',
        address: company.address ?? '',
        zip_code: company.zip_code ?? '',
      });
    }
  }, [company]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.company_name.trim()) {
      toast.error('Company name is required.');
      return;
    }

    if (!user) return;

    try {
      if (isEditing && company) {
        await updateCompany.mutateAsync({
          id: company.id,
          company_name: form.company_name.trim(),
          industry: form.industry || null,
          description: form.description.trim() || null,
          website: form.website.trim() || null,
          phone: form.phone.trim() || null,
          address: form.address.trim() || null,
          zip_code: form.zip_code.trim() || null,
        });
        toast.success('Company profile updated!');
      } else {
        await createCompany.mutateAsync({
          owner_id: user.id,
          company_name: form.company_name.trim(),
          industry: form.industry || null,
          description: form.description.trim() || null,
          website: form.website.trim() || null,
          phone: form.phone.trim() || null,
          address: form.address.trim() || null,
          zip_code: form.zip_code.trim() || null,
        });
        toast.success('Company profile created!');
        navigate('/employer');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  }

  const isSaving = createCompany.isPending || updateCompany.isPending;

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">
        {isEditing ? 'Edit Company Profile' : 'Create Company Profile'}
      </h1>

      {/* Logo & Founding Badge */}
      {isEditing && (
        <Card className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {company?.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.company_name}
                className="w-16 h-16 object-cover rounded-xl"
              />
            ) : (
              <Building2 className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-navy truncate">{company?.company_name}</h2>
            {company?.is_founding_employer && (
              <div className="flex items-center gap-1 mt-1">
                <Award className="w-4 h-4 text-yellow" />
                <Badge variant="yellow">Founding Employer</Badge>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <p className="text-xs text-gray-400">Logo upload coming soon</p>
          </div>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="space-y-5">
          <Input
            label="Company Name"
            placeholder="Your company name"
            value={form.company_name}
            onChange={(e) => updateField('company_name', e.target.value)}
            required
          />

          <Select
            label="Industry"
            placeholder="Select industry"
            options={INDUSTRY_OPTIONS}
            value={form.industry}
            onChange={(e) => updateField('industry', e.target.value)}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full px-4 py-3 rounded-card border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange placeholder:text-gray-400 font-body min-h-[100px]"
              placeholder="Tell candidates about your company, culture, and what makes you a great employer..."
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                <span className="inline-flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  Website
                </span>
              </label>
              <Input
                placeholder="https://yourcompany.com"
                value={form.website}
                onChange={(e) => updateField('website', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  Phone
                </span>
              </label>
              <Input
                placeholder="(419) 555-0123"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Address
                  </span>
                </label>
                <Input
                  placeholder="123 Main St, Toledo, OH"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>
            </div>
            <Input
              label="Zip Code"
              placeholder="43604"
              value={form.zip_code}
              onChange={(e) => updateField('zip_code', e.target.value)}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/employer')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSaving}>
            {isEditing ? 'Save Changes' : 'Create Company'}
          </Button>
        </div>
      </form>
    </div>
  );
}
