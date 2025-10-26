import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { UserLevel, Achievement, UserAchievement, XPTransaction, Badge, UserBadge } from '../types/gamification'

export const useGamification = (userId: string) => {
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)

  // Calcola XP necessario per il prossimo livello
  const calculateXPForLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(1.2, level - 1))
  }

  // Calcola il livello basato sull'XP totale
  const calculateLevel = (totalXP: number): { level: number; xp: number; xpToNext: number } => {
    let level = 1
    let xp = totalXP
    let xpToNext = calculateXPForLevel(level + 1)

    while (xp >= xpToNext) {
      xp -= xpToNext
      level++
      xpToNext = calculateXPForLevel(level + 1)
    }

    return { level, xp, xpToNext }
  }

  // Aggiungi XP all'utente
  const addXP = useCallback(async (amount: number, source: string, description: string) => {
    if (!userId) return

    try {
      // Aggiungi transazione XP
      const { error: transactionError } = await supabase
        .from('xp_transactions')
        .insert({
          user_id: userId,
          amount,
          source,
          description,
          created_at: new Date().toISOString()
        })

      if (transactionError) {
        console.error('Error adding XP transaction:', transactionError)
        return
      }

      // Aggiorna livello utente
      const { data: currentLevel, error: levelError } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (levelError && levelError.code !== 'PGRST116') {
        console.error('Error fetching user level:', levelError)
        return
      }

      const newTotalXP = (currentLevel?.total_xp || 0) + amount
      const { level, xp, xpToNext } = calculateLevel(newTotalXP)
      const leveledUp = level > (currentLevel?.level || 1)

      if (currentLevel) {
        // Aggiorna livello esistente
        const { error: updateError } = await supabase
          .from('user_levels')
          .update({
            level,
            xp,
            xp_to_next_level: xpToNext,
            total_xp: newTotalXP,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (updateError) {
          console.error('Error updating user level:', updateError)
          return
        }
      } else {
        // Crea nuovo livello
        const { error: insertError } = await supabase
          .from('user_levels')
          .insert({
            user_id: userId,
            level,
            xp,
            xp_to_next_level: xpToNext,
            total_xp: newTotalXP,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Error creating user level:', insertError)
          return
        }
      }

      // Aggiorna stato locale
      setUserLevel({
        user_id: userId,
        level,
        xp,
        xp_to_next_level: xpToNext,
        total_xp: newTotalXP,
        prestige: currentLevel?.prestige || 0,
        created_at: currentLevel?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      // Controlla achievement
      if (leveledUp) {
        await checkAchievements()
      }

      return { leveledUp, newLevel: level }
    } catch (error) {
      console.error('Error adding XP:', error)
    }
  }, [userId])

  // Controlla e sblocca achievement
  const checkAchievements = useCallback(async () => {
    if (!userId || !userLevel) return

    try {
      // Ottieni tutti gli achievement
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')

      if (achievementsError) {
        console.error('Error fetching achievements:', achievementsError)
        return
      }

      // Ottieni achievement già sbloccati
      const { data: unlockedAchievements, error: unlockedError } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId)
        .eq('is_completed', true)

      if (unlockedError) {
        console.error('Error fetching unlocked achievements:', unlockedError)
        return
      }

      const unlockedIds = unlockedAchievements?.map(ua => ua.achievement_id) || []

      // Controlla ogni achievement
      for (const achievement of allAchievements || []) {
        if (unlockedIds.includes(achievement.id)) continue

        let progress = 0
        let isCompleted = false

        switch (achievement.condition.type) {
          case 'xp':
            progress = Math.min(userLevel.total_xp, achievement.condition.value)
            isCompleted = userLevel.total_xp >= achievement.condition.value
            break
          case 'level':
            progress = Math.min(userLevel.level, achievement.condition.value)
            isCompleted = userLevel.level >= achievement.condition.value
            break
          // Aggiungi altri tipi di achievement qui
        }

        if (isCompleted) {
          // Sblocca achievement
          const { error: unlockError } = await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
              unlocked_at: new Date().toISOString(),
              progress: achievement.condition.value,
              is_completed: true
            })

          if (unlockError) {
            console.error('Error unlocking achievement:', unlockError)
            continue
          }

          // Aggiungi ricompensa
          if (achievement.reward.coins > 0) {
            await addXP(achievement.reward.coins, 'achievement', `Achievement: ${achievement.name}`)
          }

          // Aggiorna stato locale
          setUserAchievements(prev => [...prev, {
            user_id: userId,
            achievement_id: achievement.id,
            unlocked_at: new Date().toISOString(),
            progress: achievement.condition.value,
            is_completed: true,
            achievement
          }])
        } else {
          // Aggiorna progresso
          const { error: updateError } = await supabase
            .from('user_achievements')
            .upsert({
              user_id: userId,
              achievement_id: achievement.id,
              progress,
              is_completed: false
            })

          if (updateError) {
            console.error('Error updating achievement progress:', updateError)
          }
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
    }
  }, [userId, userLevel, addXP])

  // Carica dati iniziali
  useEffect(() => {
    const loadGamificationData = async () => {
      if (!userId) return

      setLoading(true)
      try {
        // Carica livello utente
        const { data: levelData, error: levelError } = await supabase
          .from('user_levels')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (levelError && levelError.code !== 'PGRST116') {
          console.error('Error loading user level:', levelError)
        } else if (levelData) {
          setUserLevel(levelData)
        }

        // Carica achievement
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')

        if (achievementsError) {
          console.error('Error loading achievements:', achievementsError)
        } else {
          setAchievements(achievementsData || [])
        }

        // Carica achievement utente
        const { data: userAchievementsData, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select(`
            *,
            achievement:achievements(*)
          `)
          .eq('user_id', userId)

        if (userAchievementsError) {
          console.error('Error loading user achievements:', userAchievementsError)
        } else {
          setUserAchievements(userAchievementsData || [])
        }

        // Carica badge
        const { data: badgesData, error: badgesError } = await supabase
          .from('badges')
          .select('*')

        if (badgesError) {
          console.error('Error loading badges:', badgesError)
        } else {
          setBadges(badgesData || [])
        }

        // Carica badge utente
        const { data: userBadgesData, error: userBadgesError } = await supabase
          .from('user_badges')
          .select(`
            *,
            badge:badges(*)
          `)
          .eq('user_id', userId)

        if (userBadgesError) {
          console.error('Error loading user badges:', userBadgesError)
        } else {
          setUserBadges(userBadgesData || [])
        }
      } catch (error) {
        console.error('Error loading gamification data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGamificationData()
  }, [userId])

  return {
    userLevel,
    achievements,
    userAchievements,
    badges,
    userBadges,
    loading,
    addXP,
    checkAchievements,
    calculateLevel
  }
}
