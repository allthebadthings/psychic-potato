import { supabase } from '../db/supabase.js';

export interface IntegrationConfig {
  service: string;
  config: any;
  is_active: boolean;
}

const localConfigs: Record<string, IntegrationConfig> = {};
const useDb = !!process.env.SUPABASE_URL;

export const configService = {
  async getConfig(service: string): Promise<IntegrationConfig | null> {
    if (!useDb) {
      return localConfigs[service] || { service, config: {}, is_active: false };
    }

    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('service', service)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return { service, config: {}, is_active: false }; // Not found, return default
      console.error(`Error fetching config for ${service}:`, error);
      return null;
    }

    return data;
  },

  async updateConfig(service: string, config: any, isActive: boolean) {
    if (!useDb) {
      localConfigs[service] = { service, config, is_active: isActive };
      return localConfigs[service];
    }

    const { data, error } = await supabase
      .from('integrations')
      .upsert(
        { 
          service, 
          config, 
          is_active: isActive,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'service' }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update config: ${error.message}`);
    }

    return data;
  }
};
