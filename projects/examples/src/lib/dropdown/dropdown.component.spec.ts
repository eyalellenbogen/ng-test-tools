import { Component } from '@angular/core';
import { TestContextBuilder } from 'test-tools/public-api';
import { DropdownComponent } from './dropdown.component';
import { DropdownPageObject } from './dropdown.component.po';

@Component({
  template: ` <lib-dropdown [items]="items" [selection]="selectedItem" (selectionChange)="selectedItemChange($event)"></lib-dropdown> `,
})
class HostComponent {
  items: string[];
  selectedItem: string;
  public selectedItemChange(item) {}
}

describe('DropdownComponent', () => {
  const ctx = TestContextBuilder.create(HostComponent).withComponent(DropdownComponent).withPageObject(DropdownPageObject).build();

  beforeEach(() => {
    ctx.bootstrap();
    ctx.setHostProp({
      items: ['iron man', 'hulk', 'captain america', 'thor', 'black widow', 'hawkeye'],
    });
  });

  it('should create', () => {
    expect(ctx.component).toBeDefined();
  });

  describe('trigger', () => {
    describe('when no item is selected', () => {
      beforeEach(() => {
        ctx.setHostProp({ selectedItem: undefined });
      });

      it('should display "select', () => {
        expect(ctx.pageObject.trigger.innerText).toBe('select');
      });
    });

    describe('when an item is selected', () => {
      beforeEach(() => {
        ctx.setHostProp({ selectedItem: ctx.host.items[2] });
      });

      it('should display selection', () => {
        expect(ctx.pageObject.trigger.innerText).toBe(ctx.host.selectedItem);
      });
    });

    describe('on click', () => {
      describe('when closed', () => {
        beforeEach(() => {
          ctx.pageObject.trigger.click();
        });
        it('should open', () => {
          expect(ctx.pageObject.dropMenu).toBeTruthy();
        });
      });
      describe('when open', () => {
        beforeEach(() => {
          ctx.component.isOpen = true;
          ctx.detectChanges();
          ctx.pageObject.trigger.click();
        });
        it('should close', () => {
          expect(ctx.pageObject.dropMenu).toBeFalsy();
        });
      });
    });

    describe('menu', () => {
      beforeEach(() => {
        ctx.pageObject.trigger.click();
        spyOn(ctx.host, 'selectedItemChange');
      });
      describe('when item clicked', () => {
        const item = 2;
        beforeEach(() => {
          ctx.pageObject.dropMenu.items[item].click();
        });
        it('should emit selectionChange', () => {
          const expected = ctx.host.items[item];
          expect(ctx.host.selectedItemChange).toHaveBeenCalledWith(expected);
        });
      });
    });
  });
});
