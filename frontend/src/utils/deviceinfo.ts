// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deviceInfo = (function () {
  const _w = window;
  const _b = document.body;
  const _d = document.documentElement;
  const _st = 'scrollTop';
  const _sh = 'scrollHeight';
  const _oh = 'offsetHeight';
  const _ch = 'clientHeight';

  return {
    screenWidth(): number {
      return Math.max(0, _w.innerWidth || _d.clientWidth || _b.clientWidth || 0);
    },
    screenHeight(): number {
      return Math.max(0, _w.innerHeight || _d.clientHeight || _b.clientHeight || 0);
    },
    screenCenterX(): number {
      return this.screenWidth() / 2;
    },
    screenCenterY(): number {
      return this.screenHeight() / 2;
    },
    pixelRatio(): number {
      return _w.devicePixelRatio;
    },
    mouseX(e: MouseEvent): number {
      return Math.max(0, e.pageX || e.clientX || 0);
    },
    mouseY(e: MouseEvent): number {
      return Math.max(0, e.pageY || e.clientY || 0);
    },
    mouseCenterX(e: MouseEvent): number {
      return this.mouseX(e) - this.screenCenterX();
    },
    mouseCenterY(e: MouseEvent): number {
      return this.mouseY(e) - this.screenCenterY();
    },
    getScrollPercent(): number {
      return ((_d[_st] || _b[_st]) / ((_d[_sh] || _b[_sh]) - _d[_ch])) * 100;
    },
    getScrollY(): number {
      return Math.max(_w.pageYOffset, _d[_st], _b[_st]);
    },
    getScrollHeight(): number {
      return Math.max(_b[_sh], _b[_oh], _d[_sh], _d[_oh], _d[_ch]);
    },
  };
})();
