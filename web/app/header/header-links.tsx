/*
 * CUBE
 * Copyright (C) 2025-2026  scidsgn
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

"use client"

import { usePathname } from "next/navigation"
import { LinkButton } from "@/app/components/button/button"

export const HeaderLinks = () => {
    const pathname = usePathname()

    return (
        <div className="pointer-events-auto flex gap-1 bg-gray-950/80 backdrop-blur-2xl">
            <LinkButton
                variant={
                    pathname.startsWith("/artists") ? "dark" : "transparent"
                }
                icon="person_2"
                href="/artists"
            >
                Artists
            </LinkButton>
            <LinkButton
                variant={
                    pathname.startsWith("/albums") ? "dark" : "transparent"
                }
                icon="library_music"
                href="/albums"
            >
                Albums
            </LinkButton>
            <LinkButton
                variant={
                    pathname.startsWith("/playlists") ? "dark" : "transparent"
                }
                icon="featured_play_list"
                href="/playlists"
            >
                Playlists
            </LinkButton>
        </div>
    )
}
