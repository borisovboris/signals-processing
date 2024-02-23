import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subject } from 'rxjs';

export abstract class BatchList {
  protected abstract viewport: CdkVirtualScrollViewport;
  
  protected scrolled$ = new Subject<void>();
  protected offset = 0;

  onScroll() {
    this.scrolled$.next();
  }

  getOffset() {
    const renderedEnd = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();

    if (renderedEnd === total && renderedEnd > this.offset) {
      this.offset = renderedEnd;
      this.getNewBatch();
    }
  }

  protected abstract getNewBatch(): void;
}
