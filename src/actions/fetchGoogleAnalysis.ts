'use server'

import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"

export default async function fetchGoogleAnalysis(googlePlaceId: string) {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const {data, error} = await supabase.from('leads').select('google_analysis').eq('google_place_id', googlePlaceId).single()

    if (error) {
        console.error('Error fetching Google analysis:', error)
        return null
    }

    return data
}
