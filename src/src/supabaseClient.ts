import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zoquwqcvlfblsoifanfk.supabase.co'
const supabaseKey = 'sb_publishable_T_QYI22v64oUSHuwIrEB8w_emUeEMON'

export const supabase = createClient(supabaseUrl, supabaseKey)
