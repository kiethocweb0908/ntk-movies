import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { type CategoryResponse } from '@workspace/shared/schema/category/category.response';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<CategoryResponse[]> {
    return this.categoryService.findAll();
  }
}
