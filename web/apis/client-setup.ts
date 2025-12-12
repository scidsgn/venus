/*
 * CUBE
 * Copyright (C) 2025  scidsgn
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { client as venusClient } from "@/apis/venus/client.gen"
import { ResolvedRequestOptions } from "@/apis/venus/client/types.gen"
import { getCookies } from "@/app/auth/cookies"
import { ReadonlyRequestCookiesAdapter } from "@/app/auth/cookies/readonly-request-cookies-adapter"
import { env } from "@/app/env"
import { cookies } from "next/headers"

async function insertAuthToken(options: ResolvedRequestOptions) {
    if (!options.headers) {
        return
    }

    const cookieStore = new ReadonlyRequestCookiesAdapter(await cookies())

    const { authCookie } = getCookies(cookieStore)
    if (authCookie) {
        const headers = options.headers as Headers

        options.headers = {
            ...Object.fromEntries(headers.entries()),
            Authorization: `Bearer ${authCookie.value}`,
        }
    }
}

export function setupClients() {
    venusClient.setConfig({
        baseUrl: env.VENUS_URL,
    })

    venusClient.interceptors.request.use(insertAuthToken)
}
