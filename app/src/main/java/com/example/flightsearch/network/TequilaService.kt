package com.example.flightsearch.network

import com.example.flightsearch.model.ApiResponse
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.GET
import retrofit2.http.QueryMap

interface TequilaService {
    @GET("v2/search")
    suspend fun search(@QueryMap params: Map<String, String>): Response<ApiResponse>

    companion object {
        fun create(apiKeyProvider: suspend () -> String?): TequilaService {
            val logging = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC }
            val client = OkHttpClient.Builder()
                .addInterceptor(logging)
                .addInterceptor { chain ->
                    val key = runCatching { kotlinx.coroutines.runBlocking { apiKeyProvider() } }.getOrNull()
                    val req = chain.request().newBuilder()
                    if (!key.isNullOrBlank()) req.addHeader("apikey", key)
                    chain.proceed(req.build())
                }
                .build()
            val retrofit = Retrofit.Builder()
                .baseUrl("https://tequila-api.kiwi.com/")
                .addConverterFactory(MoshiConverterFactory.create())
                .client(client)
                .build()
            return retrofit.create(TequilaService::class.java)
        }
    }
}
