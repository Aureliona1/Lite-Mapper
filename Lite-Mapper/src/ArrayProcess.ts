import { Easing, Vec2, copy, lerp, mapRange, random, repeat } from "./LiteMapper.ts";

export class ArrayProcess<T extends number[]> {
	/**
	 * Run several mathematical operations on an array.
	 * @param array The source array.
	 */
	constructor(public array: T) {}
	/**
	 * Add another array or a single number to the original array. Does not modify the original array.
	 * @param arr The array or number to add to original array.
	 */
	add(arr: T | number) {
		const temp = copy(this.array);
		if (typeof arr == "number") {
			return temp.map(x => x + arr) as T;
		} else {
			repeat(temp.length, i => {
				temp[i] += arr[i];
			});
			return temp as T;
		}
	}
	/**
	 * Subtract another array or a single number from the original array. Does not modify the original array.
	 * @param arr The array or number to add to original array.
	 */
	subtract(arr: T | number) {
		const temp = copy(this.array);
		if (typeof arr == "number") {
			return temp.map(x => x - arr) as T;
		} else {
			repeat(temp.length, i => {
				temp[i] -= arr[i];
			});
			return temp as T;
		}
	}
	/**
	 * Multiply original array by another array or a number. Does not modify the original array.
	 * @param arr The array or number to multiply to original array.
	 */
	multiply(arr: T | number) {
		const temp = copy(this.array);
		if (typeof arr == "number") {
			return temp.map(x => x * arr) as T;
		} else {
			repeat(temp.length, i => {
				temp[i] *= arr[i];
			});
			return temp as T;
		}
	}
	/**
	 * Divide original array by another array or a number. Does not modify the original array.
	 * @param arr The array or number to divide original array by.
	 */
	divide(arr: T | number) {
		const temp = copy(this.array);
		if (typeof arr == "number") {
			return temp.map(x => x / arr) as T;
		} else {
			repeat(temp.length, i => {
				temp[i] /= arr[i];
			});
			return temp as T;
		}
	}
	/**
	 * Interpolate array to another array or a number by a certain fraction. Does not modify the original array.
	 * @param arr The ending arr or number of the interpolation.
	 * @param fraction The fraction, or array of fractions to interpolate by.
	 * @param ease Optional easing.
	 */
	lerp(arr: T | number, fraction: T | number, ease: Easing = "easeLinear") {
		const end: T = typeof arr == "number" ? (new Array(this.array.length).fill(arr) as T) : arr,
			factor: T = typeof fraction == "number" ? (new Array(this.array.length).fill(fraction) as T) : fraction,
			temp = copy(this.array);
		repeat(temp.length, i => {
			temp[i] = lerp(temp[i], end[i], factor[i], ease);
		});
		return temp as T;
	}
	/**
	 * Randomly reorder elements in the array. Does not modify the original array.
	 * @param seed The seed for the random shuffling.
	 */
	shuffle(seed: number = Math.random()) {
		const temp = copy(this.array);
		for (let i = temp.length - 1; i > 0; i--) {
			const j = random(0, 1, seed * Math.PI * (i + 1), 0) * (i + 1);
			[temp[i], temp[j]] = [temp[j], temp[i]];
		}
		return temp as T;
	}
	/**
	 * Sorts the array from lowest to highest. Does not modify the original array.
	 */
	sortNumeric() {
		const temp = copy(this.array);
		return temp.sort((a, b) => a - b) as T;
	}

	/**
	 * Maps the array from one range to another. Does not modify the original array.
	 */
	mapRange(from: Vec2, to: Vec2) {
		const temp = copy(this.array);
		return temp.map(x => mapRange(x, from, to)) as T;
	}

	/**
	 * Clamps the range of the array to within a set min and max.
	 */
	clampRange(min: number, max: number) {
		[min, max] = min > max ? [max, min] : [min, max];
		this.min = min;
		this.max = max;
		return this.array as T;
	}

	get max() {
		return new ArrayProcess(this.array).sortNumeric()[this.array.length - 1];
	}
	set max(x) {
		this.array.forEach(a => {
			a = a > x ? x : a;
		});
	}
	set min(x) {
		this.array.forEach(a => {
			a = a < x ? x : a;
		});
	}
	get min() {
		return new ArrayProcess(this.array).sortNumeric()[0];
	}
	get range() {
		return this.max - this.min;
	}
	get mean() {
		let out = 0;
		repeat(this.array.length, i => {
			out += this.array[i];
		});
		return out / this.array.length;
	}
	get median() {
		const temp = new ArrayProcess(this.array).sortNumeric();
		return temp[Math.floor(temp.length / 2)];
	}
	get mode() {
		let arr: number[][] = [];
		const set = [...new Set(this.array)];
		repeat(set.length, i => {
			let instances = 0;
			repeat(this.array.length, j => {
				if (set[i] == this.array[j]) {
					instances++;
				}
			});
			arr.push([set[i], instances]);
		});
		arr = arr.sort((a, b) => a[1] - b[1]);
		return arr[arr.length - 1][0];
	}
}
