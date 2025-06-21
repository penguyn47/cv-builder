'use client'

import Select from 'react-select'

const options = [
	{ value: 'chocolate', label: 'Chocolate' },
	{ value: 'strawberry', label: 'Strawberry' },
	{ value: 'vanilla', label: 'Vanilla' },
]

export default function Page() {
	return (
		<div className="grid grid-cols-2">
			<div className="col-span-1">
				<div>Layouts</div>
				<div>styles</div>
				<div>color</div>
				<input type="color" className="h-10 w-10 cursor-pointer rounded border border-gray-300 p-1" />
				<div>font</div>
				<Select name="colors" options={options} classNamePrefix="select" instanceId="color-select" />
			</div>
			<div className="col-span-1">Preview sections</div>
		</div>
	)
}
