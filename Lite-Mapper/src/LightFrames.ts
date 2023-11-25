import { LightEvent, LightEventTypes, LightKeyframeFrameType, copy } from "./LiteMapper.ts";

export class LightKeyframe {
	constructor(public time = 0, public duration = 1, public type: LightEventTypes = "BackLasers", public ids?: number | number[]) {}
	private animation: LightKeyframeFrameType[] = [];
	get keyframes() {
		return this.animation.sort((a, b) => {
			if (a[4] > b[4]) return 1;
			if (a[4] < b[4]) return -1;
			return 0;
		});
	}
	set keyframes(x) {
		this.animation = x;
	}
	animationLength = 1;
	/**
	 * Add keyframes to your animation.
	 * @param frames The frames to add.
	 */
	add(...frames: LightKeyframeFrameType[]) {
		frames.forEach(x => {
			this.keyframes.push(x);
		});
		return this;
	}
	push(dupe = true) {
		const temp = dupe ? copy(this) : this;
		temp.keyframes.forEach(kf => {
			kf[4] /= this.animationLength;
			const time = this.time + kf[4] * this.duration;
			if (kf[4] == 0 || kf[5] == "easeStep") {
				const ev = new LightEvent(time).setType(this.type).setValue("On").setColor([kf[0], kf[1], kf[2], kf[3]]);
				if (this.ids) {
					ev.lightID = this.ids;
				}
				ev.push();
			} else {
				const ev = new LightEvent(time).setType(this.type).setValue("Transition").setColor([kf[0], kf[1], kf[2], kf[3]]);
				if (this.ids) {
					ev.lightID = this.ids;
				}
				ev.easing = kf[5];
				ev.lerpType = kf[6];
				ev.push();
			}
		});
	}
}
