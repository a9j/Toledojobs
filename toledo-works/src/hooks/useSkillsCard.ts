import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { SkillsCard } from '../types';

export function useSkillsCard(profileId: string | undefined) {
  return useQuery({
    queryKey: ['skills-card', profileId],
    queryFn: async () => {
      if (!profileId) return null;
      const { data, error } = await supabase
        .from('skills_cards')
        .select('*')
        .eq('profile_id', profileId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as SkillsCard | null;
    },
    enabled: !!profileId,
  });
}

export function useSaveSkillsCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (card: Partial<SkillsCard> & { profile_id: string }) => {
      const { data: existing } = await supabase
        .from('skills_cards')
        .select('id')
        .eq('profile_id', card.profile_id)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('skills_cards')
          .update({ ...card, updated_at: new Date().toISOString() })
          .eq('profile_id', card.profile_id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('skills_cards')
          .insert(card)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills-card'] });
    },
  });
}
