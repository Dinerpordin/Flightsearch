package com.example.flightsearch.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

val Context.dataStore by preferencesDataStore(name = "settings")

object Prefs {
    private val KEY_API = stringPreferencesKey("tequila_api_key")
    private val KEY_OFFLINE = booleanPreferencesKey("offline_mode")

    suspend fun getApiKey(context: Context): String? =
        context.dataStore.data.map { it[KEY_API] }.first()

    suspend fun setApiKey(context: Context, value: String) {
        context.dataStore.edit { it[KEY_API] = value }
    }

    suspend fun getOffline(context: Context): Boolean =
        context.dataStore.data.map { it[KEY_OFFLINE] ?: true }.first()

    suspend fun setOffline(context: Context, value: Boolean) {
        context.dataStore.edit { it[KEY_OFFLINE] = value }
    }
}
