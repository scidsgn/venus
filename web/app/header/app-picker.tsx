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

import { Popover } from "@/app/components/popover/popover"
import { LinkButton } from "@/app/components/button/button"

export const AppPicker = () => {
    const popoverContent = (
        <div className="w-[calc(100vw-12*var(--spacing))] max-w-64">
            <div className="p-2">
                <LinkButton href="/venus/artists" icon="music_note">
                    Music
                </LinkButton>
            </div>
            <div className="border-t-2 border-gray-700 p-2">
                <LinkButton href="/settings/general" icon="settings">
                    Settings
                </LinkButton>
            </div>
        </div>
    )

    return (
        <Popover
            className="group grid size-9 place-items-center"
            icon="apps"
            content={popoverContent}
            contentProps={{
                align: "end",
            }}
        />
    )
}
