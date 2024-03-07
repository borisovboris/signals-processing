import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CompositionActions } from '../../store/composition/composition.actions';
import * as d3 from 'd3';
import { DeviceDateStatusDTO, DeviceDetailsDTO } from '../../../../generated-sources/openapi';
import { filter, take } from 'rxjs/operators';
import { MaterialModule } from '../../material/material.module';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { deviceDetails } from '../../store/composition/composition.selectors';
import { fadeIn } from '../../shared/animations';
import { NoDataComponent } from '../../shared/no-data/no-data.component';

@Component({
  selector: 'app-device-details',
  standalone: true,
  imports: [MaterialModule, CommonModule, NoDataComponent],
  animations: [fadeIn],
  templateUrl: './device-details.component.html',
  styleUrl: './device-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailsComponent implements OnInit {
  filledStatusTimeLine?: DeviceDateStatusDTO[];
  details?: DeviceDetailsDTO;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly changeRef: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('deviceId'));
    this.store.dispatch(CompositionActions.getDeviceDetails({ id }));

    this.store
      .select(deviceDetails)
      .pipe(
        filter((deviceDetails) => deviceDetails !== undefined),
        take(1)
      )
      .subscribe((deviceDetails) => {
        this.details = deviceDetails;
        const statusTimeline = deviceDetails?.timeline ?? [];

        if (statusTimeline.length > 0) {
          this.filledStatusTimeLine = this.fillEmptyDates(statusTimeline);
          this.createChart( this.filledStatusTimeLine);
        }

        this.changeRef.markForCheck();
      });
  }

  // Sets value 0 to any dates in the past 30 days from today,
  // that do not have data.
  fillEmptyDates(data: DeviceDateStatusDTO[]) {
    const presentKeys = data.map((el) => el.date);
    const filledData: DeviceDateStatusDTO[] = [];

    for (let i = 29; i >= 0; i--) {
      const key = moment().clone().subtract(i, 'days').format('YYYY-MM-DD');

      if (!presentKeys.includes(key)) {
        filledData.push({
          date: key,
          occurrences: 0,
        });
      } else {
        const alreadyPresent = data.find(el => el.date === key);

        if(alreadyPresent !== undefined) {
          filledData.push(alreadyPresent);
        }
      }
    }

    return filledData;
  }

  createChart(data: DeviceDateStatusDTO[]) {
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 860 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select('#chart')
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
    const y = d3.scaleLinear().domain([0, this.getYExtremum(data)]).range([height, 0]);
    const yAxis = d3.axisLeft(y).tickFormat(d3.format('d')).tickValues(d3.range(this.getYExtremum(data)+1));

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

  getYExtremum(data: DeviceDateStatusDTO[]) {
    return Math.max(0, ...data.map(el => el.occurrences));
  }
}
