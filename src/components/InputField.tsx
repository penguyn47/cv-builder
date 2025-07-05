export default function InputField({ name, label, type }: { name: string; label: string; type?: string }) {
	if (type === 'textarea') {
		return (
			<div>
				<div className="text-sm">{label}:</div>
				<textarea name={name} className="h-[200px] w-full rounded border px-2 py-1" />
			</div>
		)
	}

	return (
		<div>
			<div className="text-sm">{label}:</div>
			<input type="text" name={name} className="w-full rounded border px-2 py-1" />
		</div>
	)
}
