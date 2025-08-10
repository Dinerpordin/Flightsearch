package com.example.flightsearch.data

import android.content.Context
import com.example.flightsearch.model.ApiResponse
import com.example.flightsearch.network.TequilaService
import com.example.flightsearch.offline.OfflineSearch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class FlightRepository(private val context: Context, private val service: TequilaService) {
    suspend fun search(params: Map<String, String>, offline: Boolean): Result<ApiResponse> = withContext(Dispatchers.IO) {
        try {
            if (offline) {
                val api = OfflineSearch(context).search(
                    origin = params["fly_from"] ?: "LHR",
                    destination = params["fly_to"] ?: "DAC",
                    date = params["date_from"] ?: "",
                    maxStops = params["max_stopovers"]?.toIntOrNull() ?: 2,
                    sort = params["sort"] ?: "price"
                )
                Result.success(api)
            } else {
                val resp = service.search(params)
                if (resp.isSuccessful) Result.success(resp.body() ?: ApiResponse())
                else Result.failure(RuntimeException("HTTP ${resp.code()}: ${resp.message()}"))
            }
        } catch (t: Throwable) {
            Result.failure(t)
        }
    }
}
