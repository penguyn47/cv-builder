export default function InputField({ name, label }: { name: string; label: string }) {
	return (
		<div>
			<div className="text-sm">{label}:</div>
			<input type="text" name={name} className="w-full rounded border px-2 py-1" />
		</div>
	)
}
