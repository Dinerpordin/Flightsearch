package com.example.flightsearch.offline

import android.content.Context
import com.example.flightsearch.model.ApiResponse
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okio.buffer
import okio.source

class OfflineSearch(private val context: Context) {
    private val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
    private val adapter = moshi.adapter(ApiResponse::class.java)

    fun search(origin: String, destination: String, date: String, maxStops: Int, sort: String): ApiResponse {
        val input = context.resources.openRawResource(
            context.resources.getIdentifier("sample_flights", "raw", context.packageName)
        )
        val json = input.source().buffer().readUtf8()
        val parsed = adapter.fromJson(json) ?: ApiResponse()

        val filtered = parsed.data.filter { item ->
            val route = item.route
            val startsOk = route.firstOrNull()?.flyFrom?.equals(origin, true) == true
            val endsOk = route.lastOrNull()?.flyTo?.equals(destination, true) == true
            val stops = (route.size - 1).coerceAtLeast(0)
            startsOk && endsOk && stops <= maxStops
        }

        val sorted = when (sort) {
            "duration" -> filtered.sortedBy { (it.duration?.total ?: Int.MAX_VALUE) }
            "stops" -> filtered.sortedBy { (it.route.size - 1).coerceAtLeast(0) }
            else -> filtered.sortedBy { it.price ?: Double.MAX_VALUE }
        }

        return ApiResponse(currency = parsed.currency, data = sorted)
    }
}
