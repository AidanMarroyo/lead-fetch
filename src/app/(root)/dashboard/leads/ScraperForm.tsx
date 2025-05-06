'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchLeadSchema, SearchLeadValues } from '@/lib/validation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { americanStates, canadianProvinces } from '@/utils/constants';
import LoadingButton from '@/components/LoadingButton';
import { fetchLeadsFromGoogle } from '@/actions/fetchLeads';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { ProTag } from '@/components/ui/ProTag';

interface ScraperFormProps {
  plan: 'free' | 'pro' | 'unlimited' | 'team' | null;
  onScrapeComplete: () => void;
  loading: boolean; // loading refers to plan loading state
}

export default function ScraperForm({
  plan,
  onScrapeComplete,
  loading,
}: ScraperFormProps) {
  const form = useForm<SearchLeadValues>({
    resolver: zodResolver(SearchLeadSchema),
    defaultValues: {
      keyword: '',
      city: '',
      provinceOrState: '',
      country: 'USA',
      withWebsites: false,
    },
  });

  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
  } = form;

  const country = watch('country');
  const regionList = country === 'Canada' ? canadianProvinces : americanStates;

  const onSubmit = async (values: SearchLeadValues) => {
    const fullLocation =
      `${values.city}, ${values.provinceOrState}, ${values.country}`.toLowerCase();
    const result = await fetchLeadsFromGoogle({
      keyword: values.keyword.toLowerCase(),
      location: fullLocation,
      withWebsites: values.withWebsites ?? false,
    });
    if (result?.success) {
      toast.success(`${result.count} leads found and stored`);
      onScrapeComplete();
    } else {
      toast.error(`${result.message}`);
    }
  };

  if (loading || plan === null) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
        <span className='ml-2 text-muted-foreground'>Loading plan...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={control}
          name='keyword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Plumber' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    country === 'Canada' ? 'e.g. Toronto' : 'e.g. Los Angeles'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='provinceOrState'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {country === 'Canada' ? 'Province' : 'State'}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        country === 'Canada' ? 'Ontario' : 'California'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {regionList.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='country'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select Country' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Canada'>Canada</SelectItem>
                  <SelectItem value='USA'>USA</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='withWebsites'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow relative'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(val) => {
                    if (plan === 'free' || plan === 'pro') {
                      toast.error(
                        'Upgrade to Unlimited to include businesses with websites.'
                      );
                      return;
                    }
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel className='flex items-center gap-1'>
                  Include businesses with existing websites
                  {(plan === 'free' || plan === 'pro') && (
                    <ProTag plan={'unlimited'} />
                  )}
                </FormLabel>
                {(plan === 'free' || plan === 'pro') && (
                  <p className='text-xs text-muted-foreground'>
                    Upgrade to unlock this feature.
                  </p>
                )}
              </div>
            </FormItem>
          )}
        />

        <LoadingButton type='submit' loading={isSubmitting}>
          {isSubmitting ? 'Searching...' : 'Find Leads'}
        </LoadingButton>
      </form>
    </Form>
  );
}
