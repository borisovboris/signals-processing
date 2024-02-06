import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CompositionActions } from '../../store/composition/composition.actions';
import * as d3 from 'd3';
import { DeviceDateStatusDTO } from '../../../../generated-sources/openapi';
import { timeline } from '../../store/composition/composition.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-device-details',
  standalone: true,
  imports: [],
  templateUrl: './device-details.component.html',
  styleUrl: './device-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(timeline)
      .pipe(
        filter((timeline) => timeline !== undefined),
        take(1)
      )
      .subscribe((timeline) => {
        if (timeline) {
          this.createChart(timeline);
        }
      });

    const id = Number(this.route.snapshot.paramMap.get('deviceId'));

    this.store.dispatch(CompositionActions.getDeviceStatusTimeline({ id }));
  }

  createChart(data: DeviceDateStatusDTO[]) {
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select('#my_dataviz')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.date))
      .padding(0.2);
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 5]).range([height, 0]);
    const yAxis = d3.axisLeft(y).tickFormat(d3.format('d')).ticks(5);

    svg.append('g').call(yAxis);

    // Bars
    svg
      .selectAll('mybar')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(d.date) ?? 0)
      .attr('y', (d) => y(d.occurrences))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.occurrences))
      .attr('fill', '#e68080');
  }

  ngOnDestroy(): void {
    d3.select('#my_dataviz').selectAll('svg').remove();
  }
}
