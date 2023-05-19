/**
 * Service workers mark certain points in time that are later exposed by the
 * navigation timing API.
 *
 * @see https://w3c.github.io/ServiceWorker/#service-worker-timing-info
 */
interface ServiceWorkerTimingInfo {
  /**
   * A DOMHighResTimeStamp, initially 0.
   *
   * @see https://w3c.github.io/ServiceWorker/#service-worker-timing-info-start-time
   */
  startTime: number;

  /**
   * A DOMHighResTimeStamp, initially 0.
   *
   * @see https://w3c.github.io/ServiceWorker/#service-worker-timing-info-fetch-event-dispatch-time
   */
  fetchEventDispatchTime: number;
}

export type { ServiceWorkerTimingInfo as default };
