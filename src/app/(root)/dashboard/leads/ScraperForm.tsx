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

export default function ScraperForm() {
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
      keyword: values.keyword,
      location: fullLocation,
      withWebsites: values.withWebsites ?? false,
    });
    if (result?.success) {
      toast.success(`${result.count} leads found and stored`);
    } else {
      toast.error(`${result.message}`);
    }
  };

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
                <Input placeholder='e.g. Toronto' {...field} />
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
              <FormLabel>State/Province</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={country === 'Canada' ? 'Province' : 'State'}
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
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Include businesses with existing websites</FormLabel>
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
