import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Chart} from 'chart.js';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  aSub: Subscription
  average: number
  pending = true

  constructor(
    private service: AnalyticsService
  ) {
  }

  ngAfterViewInit(): void {
      const gainConfig: any = {
        label: 'Виручка',
        color: `rgb(255, 99, 132)`
      }

    const orderConfig: any = {
      label: 'Замовлення',
      color: `rgb(54, 162, 235)`
    }

      this.aSub = this.service.getAnalitics().subscribe((data:AnalyticsPage) => {
        this.average = data.average

        gainConfig.labels = data.chart.map(item => item.label) // labels - зарезервоване слово в chart.js
        gainConfig.data = data.chart.map(item => item.gain)

        orderConfig.labels = data.chart.map(item => item.label) // labels - зарезервоване слово в chart.js
        orderConfig.data = data.chart.map(item => item.order)

        //  test data
        // gainConfig.labels.push('28.01.21')
        // gainConfig.data.push(1500)
        //  test data

        const gainCtx = this.gainRef.nativeElement.getContext('2d')
        const orderCtx = this.orderRef.nativeElement.getContext('2d')
        gainCtx.canvas.height = '300px'
        orderCtx.canvas.height = '300px'

        new Chart(gainCtx, createChartConfig(gainConfig))
        new Chart(orderCtx, createChartConfig(orderConfig))

        this.pending = false // використовуємо тут, адже потрібно, щоб DOM дерево було інціалізовано
      })
  }

  ngOnDestroy(): void {
    if(this.aSub)  {
      this.aSub.unsubscribe()
    }
  }
}

function createChartConfig({labels, data, label, color}){
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}

