import clsx from 'clsx'
import { ClassValue } from 'clsx'
import { formatDate as dateFnsFormat } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function isValidDate(dateString: string): boolean {
	if (!dateString) return false
	try {
		const date = new Date(dateString)
		return !isNaN(date.getTime()) && !!dateString.match(/^\d{4}-\d{2}-\d{2}$/)
	} catch {
		return false
	}
}

export function formatDate(dateString: string, format: string): string {
	if (!isValidDate(dateString)) return ''
	try {
		return dateFnsFormat(new Date(dateString), format)
	} catch {
		return ''
	}
}
